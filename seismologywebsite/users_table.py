from flask import Blueprint, render_template
from .db import get_db


bp = Blueprint('BP_users_database', __name__, url_prefix = '/users-database')

@bp.route('/show_all_users', methods=['GET', 'POST'])
def show_all_users():
    database = get_db()
    users = database.execute("SELECT * FROM user").fetchall()
    return render_template('database-tables/show-users.html', users=users)
