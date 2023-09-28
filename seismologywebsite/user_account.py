from flask import (
    Blueprint, flash, session, redirect, render_template, request, url_for, abort
)
from werkzeug.security import check_password_hash, generate_password_hash
from .forms import EditAccountForm, ChangePasswordForm
from . import User, db
from flask_login import current_user
bp = Blueprint('BP_user_account', __name__, url_prefix = '/user-account')


@bp.route('/show-account-details', methods=['GET'])
def show_account_details():
    user = current_user
    return render_template('user-information/account-details.html', user=user)

@bp.route('/edit-account-information', methods=["GET", "POST"])
def edit_account_information():

    user_id = session.get("user_id", None)
    user = current_user

    form = EditAccountForm(request.form)

    if request.method == "POST" and form.validate():

        email = form['email'].data
        fullname = form['fullname'].data

        user.fullname = fullname
        user.email = email
        db.session.commit()

        user = User.query.filter_by(email=email).first()
        flash("You succesfully updated your account information!", 'success')
        return redirect(url_for('BP_user_account.show_account_details'))

    return render_template('user-information/edit-account.html', user=user, form=form)


@bp.route('/change-password', methods=["GET", "POST"])
def change_password():
    user = current_user

    form = ChangePasswordForm(request.form)
    if request.method == "POST" and form.validate():
        password = form['password'].data
        new_password = form['new_password'].data

        if not check_password_hash(user.password, password):
            flash('Incorrect password!', 'danger')
            return redirect(url_for('BP_user_account.change_password'))
        user.password = generate_password_hash(new_password)
        db.session.commit()
        flash("You succesfully changed your password!", 'success')
        return redirect(url_for('BP_user_account.show_account_details'))


    return render_template('user-information/change-password.html', user=user, form=form)
