from flask import (
    Blueprint, flash, session, redirect, render_template, request, url_for, abort
)
from werkzeug.security import check_password_hash, generate_password_hash
from .db import get_db
from .forms import EditAccountForm, ChangePasswordForm
from .auth import login_required


bp = Blueprint('BP_user_account', __name__, url_prefix = '/user-account')



@bp.route('/help-and-support', methods=['GET'])
@login_required
def help_and_support():
    return render_template('user-information/help-and-support.html')


@bp.route('/show-account-details', methods=['GET'])
def show_account_details():
    database = get_db()
    user_id = session["user_id"]
    user = database.execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()
    return render_template('user-information/account-details.html', user=user)

@bp.route('/edit-account-information', methods=["GET", "POST"])
def edit_account_information():

    db = get_db()
    user_id = session.get("user_id", None)
    user = db.execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()

    form = EditAccountForm(request.form)

    if request.method == "POST" and form.validate():

        email = form['email'].data
        fullname = form['fullname'].data

        db.execute(
            'UPDATE user SET fullname=?, email=? WHERE id = ?', (fullname, email, user_id)
        )

        db.commit()

        user = db.execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()
        flash("You succesfully updated your account information!")
        return redirect(url_for('BP_user_account.show_account_details'))


    return render_template('user-information/edit-account.html', user=user, form=form)


@bp.route('/change-password', methods=["GET", "POST"])
def change_password():
    db = get_db()
    user_id = session.get("user_id", None)
    user = db.execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()

    form = ChangePasswordForm(request.form)
    if request.method == "POST" and form.validate():
        password = form['password'].data
        new_password = form['new_password'].data

        if not check_password_hash(user["password"], password):
            flash('Incorrect password!')
            return redirect(url_for('BP_user_account.change_password'))

        db.execute(
            'UPDATE user SET password=? WHERE id = ?', (generate_password_hash(new_password), user_id)
        )
        db.commit()
        flash("You succesfully changed your password!")
        return redirect(url_for('BP_user_account.show_account_details'))


    return render_template('user-information/change-password.html', user=user, form=form)

