from flask import Blueprint, flash, redirect, render_template, request, url_for, current_app
from werkzeug.security import generate_password_hash
from .forms import ForgotPasswordForm, ResetPasswordForm
from . import mail 
from flask_mail import Message
from . import User, db
from .functions import generate_password
from werkzeug.security import check_password_hash, generate_password_hash
from . import db


bp = Blueprint('BP_forgotpassword', __name__, url_prefix = '/forgot-password')



####################### forgot password functionality ##############################


@bp.route('/forgot-password-template')
def forgot_password_template():
    form = ForgotPasswordForm(request.form)
    return render_template('forgot-password/forgot-password-template.html', form=form)

@bp.route('/send-reset-email', methods=['POST'])
def send_reset_email():

    form = ForgotPasswordForm(request.form)

    if form.validate():
        # get the email from the password reset when you hit forgot password
        user_email = form['email'].data

        # search the database for the email that the user provided
        user = User.query.filter_by(email=user_email).first()

        # if it can't find any user with that email then abort
        if not user:
            flash('There is no user with that email!', 'danger')
            return redirect(url_for('BP_forgotpassword.forgot_password_template'))
        
        try:
            # generate a new random password
            new_password = generate_password()

            # create an email object
            msg = Message(
                subject="Password Reset",
                sender="seismoweb95@gmail.com",
                recipients=[user.email]
            )
            msg.html = f"""
            <h1>Password Reset</h1>
            <hr>
            <p>Use your email address and the temporary password provided below to log in into your account:</p>
            <ul>
                <li><b>Email</b>: {user.email}</li>
                <li><b>Password</b>: {new_password}</li>
            </ul>
            <p>We strongly recommend changing the temporary password to a new, unique one.</p>
            """
            mail.send(msg)
        except Exception as e:
            flash('Sorry, something went wrong. The reset password email was not sent!', 'danger')
            return redirect(url_for('BP_forgotpassword.forgot_password_template'))
        
        user.password = generate_password_hash(new_password)
        db.session.commit()
        
        flash(f'A new temporary password has been sent to your email account!', 'info')
        return(redirect(url_for('home')))
    
    return render_template('forgot-password/forgot-password-template.html', form=form)


@bp.route('/reset-password/<token>', methods=['GET'])
def reset_password_template(token):
    user = User.verify_reset_token(token, current_app)
    if user is None:
        flash('That is an invalid or expired token', 'warning')
        return redirect(url_for('BP_forgotpassword.forgot_password_template'))
    form = ResetPasswordForm(request.form)
    return render_template('forgot-password/reset-password-template.html', user=user, form=form)



@bp.route('/set-new-password/<user>', methods=['POST'])
def set_new_password(user):

    form = ResetPasswordForm(request.form)

    if form.validate():
        # get the new password and the new confirmation password from the user input
        new_password = form["new_password"].data
        new_confirmation_password = form["confirm_new_password"].data

        user = User.query.filter_by(email=user.email).first()

        user.password = generate_password_hash(new_password)

        db.session.commit()
    
        # flash successful update
        flash('Your password has been reset!', 'success')

        # redirect to home
        return redirect(url_for('auth.login'))

    return render_template('forgot-password/reset-password-template.html', user=user, form=form)






