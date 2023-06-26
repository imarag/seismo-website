from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify, get_flashed_messages
)
from werkzeug.security import check_password_hash, generate_password_hash

from .db import get_db
import functools

bp = Blueprint('topics', __name__, url_prefix = '/topics')

@bp.route('/show-topics-table', methods=['GET', 'POST'])
def show_topics_table():
    database = get_db()
    all_topics = database.execute("SELECT * FROM topics").fetchall()
    return render_template('database-tables/show-topics.html', all_topics=all_topics)

@bp.route('/add-topic', methods=['GET', 'POST'])
def add_topic():
    topic_title = request.form.get('topic-title-input')
    topic_description = request.form.get('topic-description-input')
    topic_image_name = request.form.get('topic-image-name-input')
    database = get_db()
    database.execute("INSERT INTO topics (title, description, image_name) VALUES (?, ?, ?)",
        (topic_title, topic_description, topic_image_name)
    )
    database.commit()
    return redirect(url_for('topics.show_topics_table'))

@bp.route('/add-topic-template', methods=['GET'])
def add_topic_template():
    return render_template('database-tables/add-topic.html')


@bp.route('/edit-topic', methods=['GET', 'POST'])
def edit_topic():
    topic_title = request.form.get('topic-title-input')
    topic_description = request.form.get('topic-description-input')
    topic_image_name = request.form.get('topic-image-name-input')
    topic_id = request.form.get('topic-id')
    database = get_db()
    database.execute("UPDATE topics SET title=?, description=?, image_name=? WHERE id=?",
        (topic_title, topic_description, topic_image_name, topic_id)
    )
    database.commit()
    return redirect(url_for('topics.show_topics_table'))

@bp.route('/edit-topic-template', methods=['GET'])
def edit_topic_template():
    topic_id = request.args.get('topic_id')
    database = get_db()
    topic = database.execute("SELECT * FROM topics WHERE id = ?", 
                     (topic_id,)
    ).fetchone()
    return render_template('database-tables/edit-topic.html', topic = topic)


@bp.route('/delete-topic', methods=['GET', 'POST'])
def delete_topic():
    topic_id = request.args.get('topic_id')
    database = get_db()
    database.execute("DELETE FROM topics WHERE id = ?",
        (topic_id,)
    )
    database.commit()
    return redirect(url_for('topics.show_topics_table'))