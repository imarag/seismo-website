from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify, get_flashed_messages
)
from werkzeug.security import check_password_hash, generate_password_hash

from .db import get_db
import functools

bp = Blueprint('users', __name__, url_prefix = '/users')

@bp.route('/show-users-table', methods=['GET', 'POST'])
def show_users_table():
    database = get_db()
    all_users = database.execute("SELECT * FROM user").fetchall()
    return render_template('database-tables/show-users.html', all_users=all_users)
