from flask import (
    Blueprint, flash, session, redirect, render_template, request, url_for
)
from .db import get_db


bp = Blueprint('BP_user_account', __name__, url_prefix = '/user-account')

@bp.route('/show-account-details', methods=['GET'])
def show_account_details():
    database = get_db()
    user_id = session["user_id"]
    user = database.execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()
    return render_template('user-information/account-details.html', user=user)
