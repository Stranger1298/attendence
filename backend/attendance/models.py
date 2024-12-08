from mongoengine import Document, StringField, DateTimeField, ReferenceField

# Create your models here.

class Teacher(Document):
    teacher_id = StringField(required=True, unique=True)
    name = StringField(required=True)
    
    def __str__(self):
        return f"{self.name} ({self.teacher_id})"

class Attendance(Document):
    teacher = ReferenceField(Teacher, required=True)
    date = DateTimeField(required=True)
    arrival_time = DateTimeField(required=True)
    departure_time = DateTimeField()
    
    def __str__(self):
        return f"{self.teacher.name} - {self.date.strftime('%Y-%m-%d')}"
    
    meta = {
        'ordering': ['-date']
    }
