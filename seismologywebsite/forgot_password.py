from flask import Blueprint, flash, redirect, render_template, request, url_for, current_app
from werkzeug.security import generate_password_hash
from .forms import ForgotPasswordForm, ResetPasswordForm
from . import mail 
from flask_mail import Message
from . import User, db

bp = Blueprint('BP_forgotpassword', __name__, url_prefix = '/forgot-password')



####################### forgot password functionality ##############################

def send_email(user):
    token = user.get_reset_token(current_app)
    msg = Message(
        sender = 'giannis.marar@hotmail.com', 
        recipients = [user.email],
        subject="Reset email"
        )
    
    # create the message html
    msg.body = f'''
        To reset your password visit the following link:
        { url_for('BP_forgotpassword.reset_password_template', token=token, _external=True) }
    '''

    # send the email
    mail.send(msg)


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
        
        send_email(user)
        flash("An email has been sent to your email to reset your password!", 'success')
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






