import json
from src.models.subscription import NotificationSubscription
from pywebpush import webpush


class NotificationService:
    def send_notification(title, description, subscription: NotificationSubscription):
        webpush(
            subscription.model_dump(mode="json"),
            json.dumps({"title": title, "description": description}),
            vapid_private_key="mdr67emr2r-6Fs7AFPckPU0WR4f29UkItI-JNnaA07s",
            vapid_claims={
                "sub": "mailto:denys.bielov@google.com",
            },
        )
