import markdown
from markdown.extensions.tables import TableExtension
from markdown.extensions.fenced_code import FencedCodeExtension


def render_markdown(content: str) -> str:
    """Convert markdown content to HTML."""
    md = markdown.Markdown(
        extensions=[
            TableExtension(),
            FencedCodeExtension(),
            'nl2br'
        ]
    )
    return md.convert(content)