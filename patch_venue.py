import re

file_path = r'd:\Hoc_ki_8\DoAn\Code\Code\badminton-platform\backend\venue-service\src\main\java\com\badminton\venueservice\service\VenueService.java'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the specific occurrence in updateVenue method (after the courtCount set block)
old_pattern = r'(if \(request\.getCourtCount\(\) != null\) \{\nvenue\.setCourtCount\(request\.getCourtCount\(\)\);\n\}\n\n)(Venue savedVenue = venueRepository\.save\(venue\);\n\n)(if \(request\.getCourtCount\(\) != null\) \{)'

replacement = r'\1Venue savedVenue = venueRepository.save(venue);\n\nif (request.getPolicy() != null) {\n    syncStaffRoles(savedVenue.getId(), request.getPolicy());\n}\n\n\3'

new_content = re.sub(old_pattern, replacement, content)

if new_content != content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS: Staff sync call inserted into updateVenue()")
else:
    print("PATTERN NOT FOUND - content unchanged")
    # Debug: show what we're looking for
    idx = content.find('Venue savedVenue = venueRepository.save(venue);')
    if idx >= 0:
        print(f"Found save at index {idx}")
        print(f"Context: {repr(content[idx:idx+200])}")
