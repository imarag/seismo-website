from flask import Blueprint, redirect, render_template, request, url_for, flash, current_app, abort
import shutil
import os
import json 

bp = Blueprint('BP_admin', __name__, url_prefix = '/admin')


def get_all_topics():
    fjson = open(current_app.config["ALL_TOPICS_FILE"])
    topics = json.load(fjson)["topics"]
    fjson.close()
    return topics

def topics_to_json(topics): 
    fout = open(current_app.config["ALL_TOPICS_FILE"], "w")
    json.dump(topics, fout)
    fout.close()

@bp.route('/admin-login', methods=["POST", "GET"])
def admin_login():

    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        if username == current_app.config["ADMIN_USERNAME"] and password == current_app.config["ADMIN_PASSWORD"]:
            flash("You have succesfully loged in", "success")
            return redirect(url_for("BP_admin.admin_index"))
        else:
            flash("You don't have the permission to enter this page!", "danger")
            abort(401)
    
    return render_template("admin/admin-login-page.html")
    
@bp.route('/admin-index')
def admin_index():
    return render_template("admin/admin-index.html")

@bp.route('/show-all-topics')
def show_all_topics():
    return render_template('admin/show-topics.html', topics=get_all_topics())

@bp.route('/add_topic_template')
def add_topic_template():
    return render_template('admin/add-topic-template.html')

@bp.route('/edit-topic-template/<int:topic_id>', methods=['GET'])
def edit_topic_template(topic_id):
    topics = get_all_topics()
    for tp in topics:
        if tp["id"] == topic_id:
            topic = tp
            break
    return render_template('admin/edit-topic-template.html', topic = topic)



@bp.route('/add-topic', methods=['GET', 'POST'])
def add_topic():
    topic_title = request.form.get('topic-title-input')
    topic_description = request.form.get('topic-description-input')
    topic_image_name = request.form.get('topic-image-name-input')
    topic_type = request.form.get('topic-type-input')
    topic_template_name = request.form.get('topic-template-name-input')

    topics = get_all_topics()

    topic = dict(
        id = len(topics) + 1,
        title = topic_title,
        description = topic_description,
        image_name = topic_image_name,
        type = topic_type,
        template_name = topic_template_name
    )

    new_topics = topics + [topic]
    
    topics_to_json(new_topics)

    return redirect(url_for('BP_admin.show_all_topics'))


@bp.route('/edit-topic/<int:topic_id>', methods=['GET', 'POST'])
def edit_topic(topic_id):
    topic_title = request.form.get('topic-title-input')
    topic_description = request.form.get('topic-description-input')
    topic_image_name = request.form.get('topic-image-name-input')
    topic_type = request.form.get('topic-type-input')
    topic_template_name = request.form.get('topic-template-name-input')

    topic = dict(
        id = topic_id,
        title = topic_title,
        description = topic_description,
        image_name = topic_image_name,
        type = topic_type,
        template_name = topic_template_name
    )

    topics = get_all_topics()

    new_topics = []
    for tp in topics:
        if tp["id"] == topic_id:
            tp["title"] = topic_title
            tp["description"] = topic_description
            tp["image_name"] = topic_image_name
            tp["type"] = topic_type
            tp["template_name"] = topic_template_name
        new_topics.append(tp)

    topics_to_json({"topics": new_topics})
    return redirect(url_for('BP_admin.show_all_topics'))


@bp.route('/delete-topic/<int:topic_id>', methods=['GET', 'POST'])
def delete_topic(topic_id):
    topics = get_all_topics()
    new_topics = []
    for tp in topics:
        if tp["id"] != topic_id:
            new_topics.append(tp)
            
    topics_to_json({"topics": new_topics})
    return redirect(url_for('BP_admin.show_all_topics'))


@bp.route('/reset-topics', methods=['GET', 'POST'])
def reset_topics():
    with open(os.path.join(current_app.instance_path, "all-topics-backup.json")) as fr:
        backed_up_topics = json.load(fr)
    
    topics_to_json(backed_up_topics)
    return redirect(url_for('BP_admin.show_all_topics'))


@bp.route('/clear-data-files')
def clear_data_files():
    data_file_folder = current_app.config['DATA_FILES_FOLDER']
    shutil.rmtree(data_file_folder)
    if not os.path.exists(os.path.join(current_app.root_path, 'data_files')):
        os.mkdir(os.path.join(current_app.root_path, 'data_files'))
    flash('You have succesfully cleared the "data_files" folder!', "success")
    return redirect(url_for('BP_admin.admin_index'))