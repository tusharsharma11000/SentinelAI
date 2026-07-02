import math
import time

class SpeedTracker:
    def __init__(self, fps=30, scale_factor=0.05):
        self.positions = {} # trackingId -> (x, y, timestamp)
        self.fps = fps
        self.scale_factor = scale_factor # pixels to meters conversion factor

    def update_and_calculate(self, track_id, center_x, center_y):
        """Saves target position, calculates speed (km/h) and direction."""
        curr_time = time.time()
        
        if track_id not in self.positions:
            self.positions[track_id] = (center_x, center_y, curr_time)
            return "0 km/h", "Stationary"

        prev_x, prev_y, prev_time = self.positions[track_id]
        time_diff = curr_time - prev_time
        
        if time_diff < 0.1: # Skip calculations for very high frame rates to avoid jitter
            return "Calculating...", "Stationary"

        # Calculate pixel displacement
        dx = center_x - prev_x
        dy = center_y - prev_y
        distance = math.sqrt(dx**2 + dy**2)

        # Distance in meters
        meters = distance * self.scale_factor
        
        # Speed in m/s then conversion to km/h
        speed_mps = meters / time_diff
        speed_kmh = round(speed_mps * 3.6, 1)

        # Determine heading direction
        direction = "Stationary"
        if abs(dx) > abs(dy):
            direction = "East" if dx > 0 else "West"
        else:
            # In image coordinates, y increases downwards, so dy > 0 is South
            direction = "South" if dy > 0 else "North"

        # Update cache
        self.positions[track_id] = (center_x, center_y, curr_time)
        return f"{speed_kmh} km/h", direction


def is_inside_polygon(point, polygon):
    """Ray casting algorithm to determine if a target coordinate lies inside a restricted boundary."""
    x, y = point
    inside = False
    n = len(polygon)
    
    p1x, p1y = polygon[0]
    for i in range(n + 1):
        p2x, p2y = polygon[i % n]
        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or x <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y
        
    return inside
