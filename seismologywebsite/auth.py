from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash
from .db import get_db
import functools
import datetime 
from .forms import RegistrationForm, LoginForm

bp = Blueprint('auth', __name__, url_prefix = '/auth')


################################# login - logout - register functionality ################################


@bp.route('/register', methods=['GET', 'POST'])
def register():

    form = RegistrationForm(request.form)

    if request.method == 'POST' and form.validate():
        email = form['email'].data
        fullname = form['fullname'].data
        password = form['password'].data

        db = get_db()

        try:
            db.execute(
                'INSERT INTO user (fullname, email, password) VALUES (?, ?, ?)',
                (fullname, email, generate_password_hash(password))
            )
            db.commit()
        except db.IntegrityError:
            error_message = f"User {fullname} is already registered!"
        else:
            flash('you have succesfully registered!', 'success')
            return redirect(url_for('auth.login')) 
            
        flash(error_message, 'danger')

    return render_template('auth/register.html', form=form)


@bp.route('/login', methods=['GET', 'POST'])
def login():

    form = LoginForm(request.form)

    if request.method == 'POST' and form.validate():

        email = form['email'].data
        password = form['password'].data

        db = get_db()
        error_message = None

        user = db.execute(
            'SELECT * FROM user WHERE email = ?', (email, )
        ).fetchone()

        if not user:
            error_message = 'Incorrect email'
        elif not check_password_hash(user['password'], password):
            error_message = 'Incorrect password'
        
        if error_message is None:
            session.clear()
            session['user_id'] = user['id']

            # update the last logged in date
            current_timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            db.execute(
                'UPDATE user SET last_login=? WHERE id = ?', (current_timestamp, user['id'])
            )
            db.commit()
            return redirect(url_for('home'))
        
        
        flash(error_message, 'danger')

    return render_template('auth/login.html', form=form)


@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))    
    

@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id', None)
    if not user_id:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))
        return view(**kwargs)
    return wrapped_view



################################# admin functionality ####################################



@bp.route('/admin', methods=['GET'])
def admin():

    user_id = session.get('user_id', None)
    user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()
    
    email = user['email']
    password = user['password']
    if email != 'giannis.marar@hotmail.com':
        flash("You don't have the right to access the admin page!", 'danger')
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
    return redirect(url_for('home'))
    

    