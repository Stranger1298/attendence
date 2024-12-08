from django.urls import path
from . import views

urlpatterns = [
    path('teachers/', views.get_teachers, name='get_teachers'),
    path('teachers/add/', views.add_teacher, name='add_teacher'),
    path('attendance/mark/', views.mark_attendance, name='mark_attendance'),
    path('attendance/departure/', views.mark_departure, name='mark_departure'),
    path('attendance/', views.get_attendance, name='get_attendance'),
]
