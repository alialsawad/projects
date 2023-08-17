from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from .job import main


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(main, 'interval', seconds=21600)
    scheduler.start()
