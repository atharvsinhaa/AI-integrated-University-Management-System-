import cv2
import face_recognition
import pandas as pd
from datetime import datetime
import os

attendance_file = 'attendance.csv'

if os.path.exists(attendance_file) and os.path.getsize(attendance_file) > 0:
    attendance = pd.read_csv(attendance_file)
else:
    attendance = pd.DataFrame(columns=["Name", "Date", "Time"])

known_face_encodings = []
known_face_names = []

known_faces_dir = "known_faces"

for file in os.listdir(known_faces_dir):
    if file.endswith(('.jpg', '.jpeg', '.png')):  
        image_path = os.path.join(known_faces_dir, file)
        image = face_recognition.load_image_file(image_path)
        
        try:
            encoding = face_recognition.face_encodings(image)[0] 
            known_face_encodings.append(encoding)
            name = os.path.splitext(file)[0]  
            known_face_names.append(name)
            print(f"Registered: {name}")
        except IndexError:
            print(f"No face found in {file}, skipping.")

def is_blurry(image, threshold=100.0):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    return variance < threshold

def detect_motion(prev_frame, curr_frame):
    frame_diff = cv2.absdiff(prev_frame, curr_frame)
    gray_diff = cv2.cvtColor(frame_diff, cv2.COLOR_BGR2GRAY)
    _, thresholded = cv2.threshold(gray_diff, 50, 255, cv2.THRESH_BINARY)
    non_zero_count = cv2.countNonZero(thresholded)
    return non_zero_count > 1000  

cap = cv2.VideoCapture(0)

marked_names = set()
prev_frame = None

motion_message_shown = False
blurry_message_shown = False
frame_counter = 0

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break

    
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    
    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

    
    if prev_frame is not None and not detect_motion(prev_frame, frame):
        if not motion_message_shown and frame_counter % 30 == 0: 
            cv2.putText(frame, "Move or show movement", (10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
            motion_message_shown = True

    else:
        motion_message_shown = False  

    
    if is_blurry(frame):
        if not blurry_message_shown and frame_counter % 30 == 0:
            cv2.putText(frame, "Blurry image detected", (10, frame.shape[0] - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
            blurry_message_shown = True

    else:
        blurry_message_shown = False  

    prev_frame = frame
    frame_counter += 1

    for face_encoding, face_location in zip(face_encodings, face_locations):
        
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
        name = "Unknown"

        if True in matches:
            match_index = matches.index(True)
            name = known_face_names[match_index]

            
            if name not in marked_names:
                now = datetime.now()
                current_date = now.strftime("%Y-%m-%d")
                current_time = now.strftime("%H:%M:%S")

                
                attendance = pd.concat(
                    [attendance, pd.DataFrame([{"Name": name, "Date": current_date, "Time": current_time}])],
                    ignore_index=True
                )

                marked_names.add(name)  
                print(f"Attendance marked for {name} at {current_time}")

                
                attendance.to_csv(attendance_file, index=False)

        
        top, right, bottom, left = [v * 4 for v in face_location]  
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    
    cv2.imshow("Attendance System", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


attendance.to_csv(attendance_file, index=False)
print("Attendance saved successfully.")

cap.release()
cv2.destroyAllWindows()
