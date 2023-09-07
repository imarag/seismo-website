from flask import Blueprint, render_template, request
import re
from .db import get_db


bp = Blueprint('BP_search_topics', __name__, url_prefix = '/search-topics')

page_status = {'current_page': 1, 'items_per_page': 4}


@bp.route('/next-page')
def next_page():
    page_status['current_page'] += 1

    database = get_db()
    topics = database.execute("SELECT * FROM topics").fetchall()
    current_topics = topics[(page_status['current_page'] - 1) * page_status['items_per_page']:page_status['current_page'] * page_status['items_per_page']]
    next_topics = topics[(page_status['current_page'] + 1 - 1) * page_status['items_per_page']:(page_status['current_page'] + 1) * page_status['items_per_page']]

    if not next_topics:
        next_state = 'disabled'
    else:
        next_state = 'enabled'

    if page_status['current_page'] == 1:
        previous_state = 'disabled'
    else:
        previous_state = 'enabled'


    return render_template('search-topics.html', topics=current_topics, selectedradiobutton='all topics', next_state = next_state, previous_state = previous_state)

@bp.route('/previous-page')
def previous_page():
    page_status['current_page'] -= 1

    database = get_db()
    topics = database.execute("SELECT * FROM topics").fetchall()
    current_topics = topics[(page_status['current_page'] - 1) * page_status['items_per_page'] : page_status['current_page'] * page_status['items_per_page']]
    next_topics = topics[(page_status['current_page'] + 1 - 1) * page_status['items_per_page'] : (page_status['current_page'] + 1) * page_status['items_per_page']]
    
    # i define the next topics above because i check the topics if i increase the current_page by 1. See the + 1 that i have in the next_topics 
    if not next_topics:
        next_state = 'disabled'
    else:
        next_state = 'enabled'

    # if the current_page == 1 that is if we are at the beginning of the topis, the previous state = 'disabled' else 'enabled'
    if page_status['current_page'] == 1:
        previous_state = 'disabled'
    else:
        previous_state = 'enabled'

    return render_template('search-topics.html', topics=current_topics, selectedradiobutton='all topics', previous_state = previous_state, next_state = next_state)


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

    page_status['current_page'] = 1
    previous_state = 'disabled'
    if len(topics) > page_status['items_per_page']:
        next_state = 'enabled'
    else:
        next_state = 'disabled'
    
    return render_template('search-topics.html', topics=topics, selectedradiobutton='all topics', previous_state = previous_state, next_state = next_state)


@bp.route('/filter-topics', methods=['GET','POST'])
def filter_topics():

    if request.method == "GET":
        filter_selected = request.args.get("topictype")
    else:
        filter_selected = request.form["topictype"]

    database = get_db()
    if filter_selected == "all topics":
        topics = database.execute("SELECT * FROM topics").fetchall()
    elif filter_selected == "articles":
        topics = database.execute("SELECT * FROM topics WHERE type = ?", ('static',)).fetchall()
    else:
        topics = database.execute("SELECT * FROM topics WHERE type = ?", ('interactive',)).fetchall()

    previous_state = 'disabled'
    page_status['current_page'] = 1

    if len(topics) > page_status['items_per_page']:
        topics = topics[:page_status['items_per_page']]
        next_state = 'enabled'
    else:
        next_state = 'disabled'

    return render_template('search-topics.html', topics=topics, selectedradiobutton=filter_selected, previous_state = previous_state, next_state = next_state)




