import re

file_path = r'd:\Hoc_ki_8\DoAn\Code\Code\badminton-platform\backend\venue-service\src\main\java\com\badminton\venueservice\service\VenueService.java'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Show the context around the save line
idx = content.find('Venue savedVenue = venueRepository.save(venue);')
if idx >= 0:
    print(f"Found at index {idx}")
    print(f"Context (100 chars before): {repr(content[max(0,idx-100):idx+200])}")
else:
    print("NOT FOUND")
