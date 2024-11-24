from enum import Enum

class Status(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

# Value to check
value = "in_progresss"

if value in Status:
    print("exists")
else:
    print("nop")