
import requests
from base.models import Job
from datetime import timedelta, datetime


def main():
    url = 'https://remotive.com/api/remote-jobs'
    response = requests.get(url)
    data = response.json()
    jobs = data['jobs']
    currentDate = datetime.today() - timedelta(days=31)
    formatDate = currentDate.strftime(
        '%Y-%m-%dT%H:%M:%S')
    for job in jobs:
        job_date = datetime.strptime(
            job['publication_date'], '%Y-%m-%dT%H:%M:%S')
        if Job.objects.filter(id=job['id']).exists() and formatDate < job['publication_date']:
            continue
        else:
            job_data = Job(id=job['id'], application_url=job['url'], title=job['title'], company_name=job['company_name'], category=job['category'], job_type=job["job_type"],
                           job_salary=job['salary'], job_description=job['description'], publication_date=job_date, candidate_required_location=job['candidate_required_location'])
        job_data.save()
    currentDate = datetime.today() - timedelta(days=31)
    formatDate = currentDate.strftime(
        '%Y-%m-%dT%H:%M:%S.%fZ')
    obj = Job.objects.filter(publication_date__lte=formatDate)
    obj.delete()
