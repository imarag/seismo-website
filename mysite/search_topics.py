from flask import Blueprint, render_template, request, current_app, redirect, url_for
import re
import math
import json

bp = Blueprint('BP_search_topics', __name__, url_prefix = '/search-topics')


@bp.route('/filter-topics', methods=['GET', 'POST'])
def filter_topics():

    if request.method == 'POST':
        filter_selected = request.form.get('topictype')
    else:
        filter_selected = request.args.get('topictype')

    with open(current_app.config["ALL_TOPICS_FILE"], "r") as fjson:
        topics = json.load(fjson)["topics"]

    filtered_topics = []
    if filter_selected == "articles":
        for tp in topics:
            if tp["type"] == "static":
                filtered_topics.append(tp)

    elif filter_selected == 'interactive tools':
        for tp in topics:
            if tp["type"] == "interactive":
                filtered_topics.append(tp)
    else:
        filtered_topics = topics

    return render_template('search-topics.html', topics=filtered_topics, selectedtopic=filter_selected.title()) 
        


@bp.route('/search-topic', methods=['GET'])
def search_topic():
    # get the search parameter that the user inserted
    search_param = request.args.get('search-param').lower()
    # get firstly all the topics
    with open(current_app.config["ALL_TOPICS_FILE"]) as fjson:
        topics = json.load(fjson)["topics"]

    if search_param: 
        # create an initial empty list to append the found topics
        found_topics_list = []
        # loop through all the topics
        for tp in topics:
            # get the description of each topic
            lower_description = tp["description"].lower()
            lower_title = tp["title"].lower()
            # if the search parameter that the user inserted is somewhere in the topic description,
            # append the current topic to the found list created above
            if search_param in lower_description or search_param in lower_title:
                found_topics_list.append(tp)

        selectedtopic = f'Topics that contain: {search_param}'
    else:
        found_topics_list = topics
        selectedtopic = 'All Topics'

    
    return render_template('search-topics.html', topics=found_topics_list, selectedtopic=selectedtopic) 





