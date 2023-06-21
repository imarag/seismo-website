from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash

from .db import get_db
import functools

bp = Blueprint('auth', __name__, url_prefix = '/auth')

@bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        fullname = request.form['fullname']
        password = request.form['password']

        db = get_db()
        error_message = None

        if not email:
            error_message = 'Email is required!'
        elif not fullname:
            error_message = 'Fullname is required!'
        elif not password:
            error_message = 'Password is required!'

        if not error_message:
            try:
                db.execute(
                    'INSERT INTO user (fullname, email, password) VALUES (?, ?, ?)',
                    (fullname, email, generate_password_hash(password))
                )
                db.commit()
            except db.IntegrityError:
                error_message = f"User {fullname} is already registered!"
            else:
                flash('you have succesfully registered!')
                return redirect(url_for('auth.login')) 

        flash(error_message)

    return render_template('auth/register.html')


@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        db = get_db()
        error_message = None

        user = db.execute(
            'SELECT * FROM user WHERE email = ?', (email, )
        ).fetchone()

        if not user:
            error_message = 'Incorrect username'
        elif not check_password_hash(user['password'], password):
            error_message = 'Incorrect password'
        
        if error_message is None:
            session.clear()
            session['user_id'] = user['id']
            user_fullname = user['fullname']
            flash(f'Welcome home, {user_fullname}!')
            return redirect(url_for('home', user_fullname=user_fullname))
        
        
        flash(error_message)

    return render_template('auth/login.html')

@bp.route('/admin', methods=['GET'])
def admin():

    user_id = session.get('user_id', None)
    user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()
    
    email = user['email']
    password = user['password']
    if email != 'giannis.marar@hotmail.com':
        flash("You don't have the right to access the admin page!")
        return redirect(url_for('home'))

    users = get_db().execute('SELECT * FROM user').fetchall()
    return render_template('auth/admin.html', users=users)

@bp.route('/delete-user', methods=['GET'])
def delete_user():
    user_id = request.args.get('userID')
    db = get_db()
    user = db.execute(
        'DELETE FROM user WHERE id = ?', (user_id,)
    )
    db.commit()
    return jsonify({'message': 'User deleted successfully'})
    
    # return {'message': 'succesfully removed the user'}
    
    
    
@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id', None)
    if not user_id:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()




@bp.route('/logout')
def logout():
    session.clear()
    flash('You have succesfully logged out!')
    return redirect(url_for('index'))

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view