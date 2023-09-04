from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash
from .db import get_db
import functools
import datetime 
from .forms import RegistrationForm, LoginForm

bp = Blueprint('auth', __name__, url_prefix = '/auth')


####################### forgot password functionality ##############################

@bp.route('/set-new-password/<user_email>', methods=['POST'])
def set_new_password(user_email):

    # get the new password and the new confirmation password from the user input
    new_password = request.form["new-password-input"]
    new_confirmation_password = request.form["new-password-confirmation-input"]

    # if any of the fields is empty abort
    if not new_password or not new_confirmation_password:
        flash('You need to fill in both fields to continue!', 'danger')
        return redirect(url_for('auth.reset_password'))
    
    # if the new password is not equal to the new confirmation password abort
    if new_password != new_confirmation_password:
        flash('New password must match with the confirmation password!', 'danger')
        return redirect(url_for('auth.reset_password'))
    
    # open the database
    db = get_db()

    # get the user with that email (the email that we pass in <user_email>)
    user = db.execute("SELECT * FROM user WHERE email = ?", (user_email,)).fetchone()

    # update the password of that user with user['id'] id
    db.execute(
        'UPDATE user SET password = ? WHERE id = ?', (generate_password_hash(new_password), user['id'])
        )
    db.commit()
   
    # flash successful update
    flash('Your password has been reset!', 'success')

    # redirect to home
    return redirect(url_for('home'))


@bp.route('/reset-password/<user_email>', methods=['GET'])
def reset_password(user_email):
    return render_template('auth/reset-password.html', user_email=user_email)

@bp.route('/forgot-password', methods=['GET'])
def forgot_password():
    return render_template('auth/forgot-password.html')



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
    

    