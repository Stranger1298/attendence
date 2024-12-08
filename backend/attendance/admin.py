from django.contrib import admin
from .models import Teacher, Attendance

# MongoDB models don't work directly with Django admin
# We'll create a custom view to manage the data

# @admin.register(Teacher)
# class TeacherAdmin(admin.ModelAdmin):
#     list_display = ('teacher_id', 'name')
#     search_fields = ('teacher_id', 'name')

# @admin.register(Attendance)
# class AttendanceAdmin(admin.ModelAdmin):
#     list_display = ('teacher', 'date', 'arrival_time', 'departure_time')
#     list_filter = ('date', 'teacher')
#     search_fields = ('teacher__name', 'teacher__teacher_id')
