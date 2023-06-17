import sqlite3
import click
from flask import current_app, g

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

# @bp.route('/show-database')
# def show_database():
#     db = get_db()
#     users = db.execute('SELECT * FROM user').fetchall()
#     for user_info in users:
#         print(user_info)

@click.command('show-db')
def show_db_command():
    db = get_db()
    users = db.execute('SELECT * FROM user').fetchall()
    user_info = []
    for user in users:
        user_info.append(f"ID: {user['id']} | fullname: {user['fullname']} | Email: {user['email']}")

    click.echo('\n'.join(user_info))
    click.echo('Displayed all users from the database.')

@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the seismo database.')

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(show_db_command)