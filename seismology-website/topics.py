from flask import Flask, flash, make_response, Blueprint, current_app, render_template, url_for, abort, request, jsonify, Response, session, send_from_directory, send_file, redirect
import re
from .db import get_db
from .auth import login_required



bp = Blueprint('BP_topics', __name__, url_prefix = '/topics')


@bp.route('/filter-topics/<filter>', methods=['GET','POST'])
def filter_topics(filter="all topics"):
    database = get_db()

    if request.method == "GET":
        if filter == "all":
            selectedradiobutton = "all topics"
            topics = database.execute("SELECT * FROM topics").fetchall()
        elif filter == "articles":
            selectedradiobutton = "articles"
            topics = database.execute("SELECT * FROM topics WHERE type = ?", ('static',)).fetchall()
        else:
            selectedradiobutton = "interactive tools"
            topics = database.execute("SELECT * FROM topics WHERE type = ?", ('interactive',)).fetchall()
    
    else:
        filter = request.form["topic-type"]
        if filter == "all":
            selectedradiobutton = "all topics"
            topics = database.execute("SELECT * FROM topics").fetchall()
        elif filter == "articles":
            selectedradiobutton = "articles"
            topics = database.execute("SELECT * FROM topics WHERE type = ?", ('static',)).fetchall()
        else:
            selectedradiobutton = "interactive tools"
            topics = database.execute("SELECT * FROM topics WHERE type = ?", ('interactive',)).fetchall()
    

    return render_template('topics.html', topics=topics, selectedradiobutton=selectedradiobutton)



@bp.route('/search', methods=['POST'])
def search():
    search_param = request.form.get('search-param')
    database = get_db()
    topics = database.execute("SELECT * FROM topics").fetchall()
    if not search_param:
        return render_template('topics.html', topics=topics, selectedradiobutton='all topics')
    else:
        found_topics_list = []
        for tp in topics:
            lower_search_param = search_param.lower()
            lower_description = tp['description'].lower()
            if re.search(lower_search_param, lower_description):
                found_topics_list.append(tp)
        return render_template('topics.html', topics=found_topics_list, selectedradiobutton='all topics')

