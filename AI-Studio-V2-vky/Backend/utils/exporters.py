# utils/exporters.py
import json
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def export_txt(messages):
    content = "\n\n".join(
        f"{m['role'].upper()}:\n{m['content']}" for m in messages
    )
    return content.encode("utf-8")


def export_json(messages):
    return json.dumps(messages, indent=2).encode("utf-8")


def export_pdf(messages):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    y = height - 40
    margin = 40
    line_height = 14
    max_width = width - 2 * margin
    
    for m in messages:
        # Role header
        role_text = f"{m['role'].upper()}:"
        if y < margin + line_height * 2:
            c.showPage()
            y = height - 40
        
        c.setFont("Helvetica-Bold", 10)
        c.drawString(margin, y, role_text)
        y -= line_height
        
        # Content with word wrapping
        c.setFont("Helvetica", 10)
        for line in m["content"].split("\n"):
            # Wrap long lines
            wrapped_lines = simpleSplit(line if line else " ", "Helvetica", 10, max_width)
            
            for wrapped in wrapped_lines:
                if y < margin + line_height:
                    c.showPage()
                    y = height - 40
                
                c.drawString(margin, y, wrapped)
                y -= line_height
        
        # Space between messages
        y -= line_height
    
    c.save()
    buffer.seek(0)
    return buffer.read()
