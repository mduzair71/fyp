ALLOWED_IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
ALLOWED_VIDEO_EXT = {".mp4", ".webm", ".mov"}
ALLOWED_MIME = {
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/webm", "video/quicktime",
}
MAX_IMAGE_BYTES = 5 * 1024 * 1024
MAX_VIDEO_BYTES = 25 * 1024 * 1024


def validate_upload(filename: str, content_type: str | None, size: int) -> str:
    from pathlib import Path
    ext = Path(filename or "").suffix.lower()
    if ext in ALLOWED_IMAGE_EXT:
        if size > MAX_IMAGE_BYTES:
            raise ValueError("Image must be 5MB or smaller")
    elif ext in ALLOWED_VIDEO_EXT:
        if size > MAX_VIDEO_BYTES:
            raise ValueError("Video must be 25MB or smaller")
    else:
        raise ValueError("Only JPG, PNG, WEBP, GIF, MP4, WEBM, MOV files are allowed")
    if content_type and content_type not in ALLOWED_MIME and not content_type.startswith("image/") and not content_type.startswith("video/"):
        raise ValueError("Invalid file type")
    return ext
