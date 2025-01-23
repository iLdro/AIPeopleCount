import random
import requests
import time
# Simulate the differents routes using 2 batimens, containing each 2 cameras
cameras = ["camera1", "camera2", "camera3", "camera4"]
buildings = ["batiment1", "batiment2"]

camera_for_building = {
    "batiment1": ["camera1", "camera2"],
    "batiment2": ["camera3", "camera4"]
}

base_url = "http://localhost:3000/"

addPeople = "building/people/add/"
removePeople = "building/people/remove/"

peopleOnCamera = "camera/"

rslt = requests.get(base_url + "building/list")
print(rslt.content.decode())

#Camera1 and 2 are for building 1, and camera 3 and 4 are for building 2
# for i in range(100):
#     building = random.choice(buildings)
#     camera = random.choice(camera_for_building[building])
#     plusOrMinus = random.randint(0, 1)
#     requests.post(base_url + peopleOnCamera + camera, json={"people": random.randint(0, 10)})
#     if plusOrMinus == 0:
#         print("add for batiment " + building)
#         call = requests.post(base_url + addPeople + building, json={"cameraId": camera})
#     else:
#         print("remove for batiment " + building)
#         requests.post(base_url + removePeople + building, json={"cameraId": camera})

#     time.sleep(0.5)
