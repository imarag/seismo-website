from flask import Blueprint, render_template, request
import re
from .db import get_db


bp = Blueprint('BP_search_topics', __name__, url_prefix = '/search-topics')


@bp.route('/search-topic', methods=['POST'])
def search_topic():
    search_param = request.form.get('search-param')
    database = get_db()
    topics = database.execute("SELECT * FROM topics").fetchall()

    if not search_param:
        topics = topics
    else:
        found_topics_list = []
        for tp in topics:
            lower_search_param = search_param.lower()
            lower_description = tp['description'].lower()
            if re.search(lower_search_param, lower_description):
                found_topics_list.append(tp)
        topics = found_topics_list
    
    return render_template('search-topics.html', topics=topics, selectedradiobutton='all topics')


@bp.route('/filter-topics', methods=['GET','POST'])
def filter_topics():

    if request.method == "GET":
        filter_selected = request.args.get("topictype")
    else:
        filter_selected = request.form["topictype"]
    print(filter_selected, "*************")
    database = get_db()
    if filter_selected == "all topics":
        topics = database.execute("SELECT * FROM topics").fetchall()
    elif filter_selected == "articles":
        topics = database.execute("SELECT * FROM topics WHERE type = ?", ('static',)).fetchall()
    else:
        topics = database.execute("SELECT * FROM topics WHERE type = ?", ('interactive',)).fetchall()

    return render_template('search-topics.html', topics=topics, selectedradiobutton=filter_selected)




