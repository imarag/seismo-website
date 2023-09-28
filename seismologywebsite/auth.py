from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash
import datetime 
from flask_login import login_required, login_user, logout_user
from .forms import RegistrationForm, LoginForm
from . import User, Topic 
from . import db
from . import login_manager

bp = Blueprint('auth', __name__, url_prefix = '/auth')


################################# login - logout - register functionality ################################
@bp.route('/register', methods=['GET', 'POST'])
def register():

    form = RegistrationForm(request.form)

    if request.method == 'POST' and form.validate():
        # get the form data
        email = form['email'].data
        fullname = form['fullname'].data
        password = form['password'].data

        # check if the user email already exists
        user = User.query.filter_by(email=email).first()

        if user:
            flash('A user with that email already exists!', 'danger')
        else:
            new_user = User(fullname=fullname, password=generate_password_hash(password), email=email)
            db.session.add(new_user)
            db.session.commit()

            flash('Registration successful. You can now log in.', 'success')
            return redirect(url_for('auth.login'))
            
    return render_template('auth/register.html', form=form)


@bp.route('/login', methods=['GET', 'POST'])
def login():

    form = LoginForm(request.form)

    if request.method == 'POST' and form.validate():
        # get the form data
        email = form['email'].data
        password = form['password'].data
        remember_me = 'remember-me' in form

        # initialize an empty error messaage
        error_message = None 

        # get the user by email
        user = User.query.filter_by(email=email).first()

        # if the user does not exists with that email of the password does not match, error
        if not user:
            error_message = 'Incorrect email'
        elif not check_password_hash(user.password, password):
            error_message = 'Incorrect password'
        
        if error_message is None:
            # login the user
            login_user(user, remember=remember_me)

            # flash succesful login
            flash('Login successful. Welcome, {}!'.format(user.fullname), 'success')

            # update the last logged in date
            current_timestamp = datetime.datetime.now()

            user.last_login = current_timestamp
            db.session.commit()

            # get the next page that the user requested if wasn't logged in
            next_page = request.args.get('next')

            return redirect(next_page) if next_page else redirect(url_for('home'))

        flash(error_message, 'danger')

    return render_template('auth/login.html', form=form)


@bp.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))  
    
@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))



################################# admin functionality ####################################



# @bp.route('/admin', methods=['GET'])
# def admin():

#     user_id = session.get('user_id', None)
#     user = get_db().execute(
#             'SELECT * FROM user WHERE id = ?', (user_id,)
#         ).fetchone()
    
#     email = user['email']
#     password = user['password']
#     if email != 'giannis.marar@hotmail.com':
#         flash("You don't have the right to access the admin page!", 'danger')
#         return redirect(url_for('home'))

#     users = get_db().execute('SELECT * FROM user').fetchall()
#     return render_template('auth/admin.html', users=users)

# @bp.route('/delete-user', methods=['GET'])
# def delete_user():
#     user_id = request.args.get('userID')
#     db = get_db()
#     user = db.execute(
#         'DELETE FROM user WHERE id = ?', (user_id,)
#     )
#     db.commit()
#     return redirect(url_for('home'))
    

    