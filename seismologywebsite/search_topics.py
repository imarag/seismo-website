from flask import Blueprint, render_template, request, current_app, redirect, url_for
import re
import math
from . import Topic, db


bp = Blueprint('BP_search_topics', __name__, url_prefix = '/search-topics')


@bp.route('/filter-topics', methods=['GET', 'POST'])
def filter_topics():

    if request.method == 'POST':
        filter_selected = request.form.get('topictype')
    else:
        filter_selected = request.args.get('topictype')

    if filter_selected == "all topics":
        topics = Topic.query.all()

    elif filter_selected == "articles":
        topics = Topic.query.filter_by(type='static').all()

    elif filter_selected == 'interactive tools':
        topics = Topic.query.filter_by(type='interactive').all()

    return render_template('search-topics.html', topics=topics, selectedradiobutton=filter_selected.title()) 
        


@bp.route('/search-topic', methods=['GET'])
def search_topic():
    # get the search parameter that the user inserted
    search_param = request.args.get('search-param').lower()
    # get firstly all the topics
    topics = Topic.query.all()

    if search_param: 
        # create an initial empty list to append the found topics
        found_topics_list = []
        # loop through all the topics
        for tp in topics:
            # get the description of each topic
            lower_description = tp.description.lower()
            lower_title = tp.title.lower()
            # if the search parameter that the user inserted is somewhere in the topic description,
            # append the current topic to the found list created above
            if search_param in lower_description or search_param in lower_title:
                found_topics_list.append(tp)
        topics = found_topics_list
        selectedradiobutton = f'Topics that contain: {search_param}'
    else:
        selectedradiobutton = 'All Topics'

    
    return render_template('search-topics.html', topics=topics, selectedradiobutton=selectedradiobutton) 





