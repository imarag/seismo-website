from flask import (
    Blueprint, flash, redirect, render_template, request, url_for
)
from .db import get_db


bp = Blueprint('BP_topics_database', __name__, url_prefix = '/topics-database')

@bp.route('/show-all-topics', methods=['GET'])
def show_all_topics():
    database = get_db()
    topics = database.execute("SELECT * FROM topics").fetchall()
    return render_template('database-tables/show-topics.html', topics=topics)


@bp.route('/show_add_template_page', methods=['GET'])
def show_add_template_page():
    return render_template('database-tables/add-topic.html')


@bp.route('/show-edit-template-page/<topic_id>', methods=['GET'])
def show_edit_template_page(topic_id):
    database = get_db()
    topic = database.execute("SELECT * FROM topics WHERE id = ?", (topic_id,)
    ).fetchone()
    return render_template('database-tables/edit-topic.html', topic = topic)






@bp.route('/add-topic', methods=['GET', 'POST'])
def add_topic():
    topic_title = request.form.get('topic-title-input')
    topic_description = request.form.get('topic-description-input')
    topic_image_name = request.form.get('topic-image-name-input')
    topic_type = request.form.get('topic-type-input')
    topic_template_name = request.form.get('topic-template-name-input')

    database = get_db()
    database.execute("INSERT INTO topics (title, description, image_name, type, template_name) VALUES (?, ?, ?, ?, ?)",
        (topic_title, topic_description, topic_image_name, topic_type, topic_template_name)
    )
    database.commit()
    return redirect(url_for('BP_topics_database.show_all_topics'))


@bp.route('/edit-topic/<topic_id>', methods=['GET', 'POST'])
def edit_topic(topic_id):
    topic_title = request.form.get('topic-title-input')
    topic_description = request.form.get('topic-description-input')
    topic_image_name = request.form.get('topic-image-name-input')
    topic_type = request.form.get('topic-type-input')
    topic_template_name = request.form.get('topic-template-name-input')

    database = get_db()
    database.execute("UPDATE topics SET title=?, description=?, image_name=?, type=?, template_name=? WHERE id=?",
        (topic_title, topic_description, topic_image_name, topic_type, topic_template_name, topic_id)
    )
    database.commit()
    return redirect(url_for('BP_topics_database.show_all_topics'))


@bp.route('/delete-topic/<topic_id>', methods=['GET', 'POST'])
def delete_topic(topic_id):
    database = get_db()
    database.execute("DELETE FROM topics WHERE id = ?",
        (topic_id,)
    )
    database.commit()
    return redirect(url_for('BP_topics_database.show_all_topics'))

