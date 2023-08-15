from flask import (
    Blueprint, flash, session, redirect, render_template, request, url_for, abort
)
from werkzeug.security import check_password_hash, generate_password_hash
from .db import get_db


bp = Blueprint('BP_user_account', __name__, url_prefix = '/user-account')



@bp.route('/help-and-support', methods=['GET'])
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

    if not user_id:
        flash('You need to be logged in to use this option!')
        return redirect(url_for('BP_user_account.edit_account_information'))

    user = db.execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()
    if request.method == "POST":
        fullname = request.form['fullname-input']
        email = request.form['email-input']

        if not fullname or not email:
            flash('You need to fill in both fields!')
            return redirect(url_for('BP_user_account.edit_account_information'))

        db.execute(
        'UPDATE user SET fullname=?, email=? WHERE id = ?', (fullname, email, user_id)
        )
        db.commit()
        user = db.execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()
        flash("You succesfully updated your account information!")
        return redirect(url_for('BP_user_account.show_account_details'))


    return render_template('user-information/edit-account.html', user=user)



@bp.route('/change-password', methods=["GET", "POST"])
def change_password():
    db = get_db()
    user_id = session.get("user_id", None)

    if not user_id:
        flash('You need to be logged in to use this option!')
        return redirect(url_for('BP_user_account.edit_account_information'))

    user = db.execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()
    if request.method == "POST":
        current_password = request.form['current-password-input']
        new_password = request.form['new-password-input']
        new_password_confirmation = request.form['new-password-confirmation-input']

        if not current_password or not new_password or not new_password_confirmation:
            flash('You need to fill in all fields!')
            return redirect(url_for('BP_user_account.change_password'))

        if not check_password_hash(user["password"], current_password):
            flash('Incorrect password!')
            return redirect(url_for('BP_user_account.change_password'))
        
        if new_password != new_password_confirmation:
            flash('New password must match with the confirmation password!')
            return redirect(url_for('BP_user_account.change_password'))
        

        db.execute(
        'UPDATE user SET password=? WHERE id = ?', (generate_password_hash(new_password), user_id)
        )
        db.commit()
        flash("You succesfully changed your password!")
        return redirect(url_for('BP_user_account.show_account_details'))


    return render_template('user-information/change-password.html', user=user)

