from flask import (
    Blueprint, flash, g, current_app, redirect, render_template, request, session, url_for, jsonify, get_flashed_messages
)
from .db import get_db
from werkzeug.security import check_password_hash, generate_password_hash


bp = Blueprint('all_topics', __name__, url_prefix = '/all_topics')



