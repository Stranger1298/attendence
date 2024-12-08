from django.shortcuts import render
from django.http import JsonResponse
from .models import Teacher, Attendance
from datetime import datetime
import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

@csrf_exempt
def get_teachers(request):
    teachers = Teacher.objects.all()
    teachers_list = [{"teacher_id": t.teacher_id, "name": t.name} for t in teachers]
    return JsonResponse({"teachers": teachers_list})

@csrf_exempt
def add_teacher(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        teacher = Teacher(
            teacher_id=data['teacher_id'],
            name=data['name']
        )
        teacher.save()
        return JsonResponse({"message": "Teacher added successfully"})
    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def mark_attendance(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        teacher = Teacher.objects.get(teacher_id=data['teacher_id'])
        attendance = Attendance(
            teacher=teacher,
            date=datetime.now(),
            arrival_time=datetime.now()
        )
        attendance.save()
        return JsonResponse({"message": "Attendance marked successfully"})
    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def mark_departure(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        teacher = Teacher.objects.get(teacher_id=data['teacher_id'])
        attendance = Attendance.objects.filter(teacher=teacher, departure_time=None).first()
        if attendance:
            attendance.departure_time = datetime.now()
            attendance.save()
            return JsonResponse({"message": "Departure time marked successfully"})
        return JsonResponse({"error": "No active attendance found"}, status=404)
    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def get_attendance(request):
    attendance_records = Attendance.objects.all()
    records = []
    for record in attendance_records:
        records.append({
            "teacher_name": record.teacher.name,
            "teacher_id": record.teacher.teacher_id,
            "date": record.date.strftime("%Y-%m-%d"),
            "arrival_time": record.arrival_time.strftime("%H:%M:%S"),
            "departure_time": record.departure_time.strftime("%H:%M:%S") if record.departure_time else None
        })
    return JsonResponse({"attendance_records": records})
