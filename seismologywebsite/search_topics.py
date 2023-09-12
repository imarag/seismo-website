from flask import Blueprint, render_template, request, current_app, redirect, url_for
import re
import math
from .db import get_db



bp = Blueprint('BP_search_topics', __name__, url_prefix = '/search-topics')

@bp.route("/get-search-topics")
def get_search_topics():

    database = get_db()

    if current_app.config['topic_type_selected'] == "all topics":
        topics = database.execute("SELECT * FROM topics").fetchall()
        selectedradiobutton = "all topics"

    elif current_app.config['topic_type_selected'] == "articles":
        topics = database.execute("SELECT * FROM topics WHERE type = ?", ('static',)).fetchall()
        selectedradiobutton = "articles"

    elif current_app.config['topic_type_selected'] == 'interactive tools':
        topics = database.execute("SELECT * FROM topics WHERE type = ?", ('interactive',)).fetchall()
        selectedradiobutton = "interactive tools"
    else:
        lower_search_param  = current_app.config['search_topic_pattern'].lower()
        selectedradiobutton = "all topics"
        topics = database.execute("SELECT * FROM topics").fetchall()
        
        found_topics_list = []
        for tp in topics:
            lower_description = tp['description'].lower()
            if re.search(lower_search_param, lower_description):
                found_topics_list.append(tp)
        topics = found_topics_list
        

    current_topics = topics[(current_app.config['current_page'] * current_app.config['items_per_page'] - current_app.config['items_per_page']):(current_app.config['current_page'] * current_app.config['items_per_page'])]
    next_topics = topics[((current_app.config['current_page'] + 1) * current_app.config['items_per_page'] - current_app.config['items_per_page']):((current_app.config['current_page'] + 1) * current_app.config['items_per_page'])]
    
    if not next_topics:
        next_state = 'disabled'
    else:
        next_state = 'enabled' 

    if current_app.config['current_page'] == 1:
        previous_state = 'disabled'
    else:
        previous_state = 'enabled'

    total_show_pages = math.ceil(len(topics) / current_app.config['items_per_page'])

    return render_template(
        'search-topics.html', 
        topics=current_topics, 
        selectedradiobutton=selectedradiobutton, 
        previous_state = previous_state, 
        next_state = next_state,
        total_show_pages = total_show_pages,
        mark_page = current_app.config['current_page']
        )


    
@bp.route('/filter-topics', methods=['GET','POST'])
def filter_topics():

    if request.method == "GET":
        filter_selected = request.args.get("topictype")
    else:
        filter_selected = request.form["topictype"]
    
    current_app.config['topic_type_selected'] = filter_selected
    current_app.config['current_page'] = 1
    return redirect(url_for('BP_search_topics.get_search_topics'))



@bp.route('/next-page')
def next_page():
    current_app.config['current_page'] += 1
    return redirect(url_for('BP_search_topics.get_search_topics'))


@bp.route('/previous-page')
def previous_page():
    current_app.config['current_page'] -= 1
    return redirect(url_for('BP_search_topics.get_search_topics'))


@bp.route('/topic-number-page/<topic_number>')
def topic_number_page(topic_number):
    topic_number = int(topic_number)
    current_app.config['current_page'] = topic_number
    return redirect(url_for('BP_search_topics.get_search_topics'))


@bp.route('/search-topic', methods=['POST'])
def search_topic():
    search_param = request.form.get('search-param')
    current_app.config['search_topic_pattern'] = search_param
    current_app.config['topic_type_selected'] = 'custom'
    current_app.config['current_page'] = 1
    return redirect(url_for('BP_search_topics.get_search_topics'))





