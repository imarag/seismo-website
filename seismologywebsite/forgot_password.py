from flask import Blueprint, flash, redirect, render_template, request, url_for
from werkzeug.security import generate_password_hash
from .forms import ForgotPasswordForm, ResetPasswordForm
from .functions import send_email
from . import mail 
from flask_mail import Message
from . import User, db

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
        
        # i can't user jinja in the msg.html below. So i create the link url that the email message will have, here
        # it will send the user to the reset_password. Pass also the user_email to use it later
        reset_password_url = url_for('BP_forgotpassword.reset_password_template', user_email=user_email, _external=True)

        # create the message html
        message = f"""
            <h1>Click the link below to reset your email</h1>
            <div>
                <a href="{reset_password_url}">Reset password</a>
            </div>
        """

        send_email(mail, user.email, message)
        flash("An email has been sent to your email to reset your password!", 'danger')
        return(redirect(url_for('home')))
    
    return render_template('forgot-password/forgot-password-template.html', form=form)


@bp.route('/reset-password/<user_email>', methods=['GET'])
def reset_password_template(user_email):
    form = ResetPasswordForm(request.form)
    return render_template('forgot-password/reset-password-template.html', user_email=user_email, form=form)



@bp.route('/set-new-password/<user_email>', methods=['POST'])
def set_new_password(user_email):

    form = ResetPasswordForm(request.form)

    if form.validate():
        # get the new password and the new confirmation password from the user input
        new_password = form["new_password"].data
        new_confirmation_password = form["confirm_new_password"].data


        # get the user with that email (the email that we pass in <user_email>)
        user = User.query.filter_by(email=user_email).first()

        user.password = generate_password_hash(new_password)

        db.session.commit()
    
        # flash successful update
        flash('Your password has been reset!', 'success')

        # redirect to home
        return redirect(url_for('home'))

    return render_template('forgot-password/reset-password-template.html', user_email=user_email, form=form)






