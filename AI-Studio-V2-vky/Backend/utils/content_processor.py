import os
import fitz  # PyMuPDF
import pandas as pd
from PIL import Image
import pytesseract
import openai
import logging
import re
import json
from typing import List, Dict, Tuple, Any, Optional
from io import BytesIO

logger = logging.getLogger(__name__)


class ContentProcessor:
    """Combined utility for image processing, table processing, and content classification"""

    def __init__(self):
        self.openai_model = "gpt-4o"  # Use gpt-4o for vision capabilities

        # Content type detection patterns
        self.TABLE_PATTERNS = [
            r'\|\s*[^|]+\s*\|',  # Markdown table format
            r'^\s*[A-Za-z0-9\s]+\s*\t',  # Tab-separated
            r'^\s*[A-Za-z0-9\s]+\s*,',   # CSV-like
        ]

        self.FIGURE_PATTERNS = [
            r'figure\s*\d+',
            r'image\s*\d+',
            r'chart\s*\d+',
            r'graph\s*\d+',
            r'diagram\s*\d+',
            r'visualization',
        ]

        # Section headers for classification
        self.SECTION_HEADERS = [
            "ABSTRACT", "INTRODUCTION", "METHODS", "METHOD",
            "RESULTS", "DISCUSSION", "CONCLUSION", "REFERENCES",
            "TABLE", "FIGURE", "SUPPLEMENTARY"
        ]

    def process_image_content(self, file_content: bytes, filename: str) -> str:
        """Process image files using OCR or Vision API"""
        try:
            img = Image.open(BytesIO(file_content))

            # Check if it's a scanned document
            if self._is_scanned_image(img):
                return self._extract_ocr_text(img)
            else:
                return self._extract_vision_description(file_content)

        except Exception as e:
            logger.error(f"Image processing failed for {filename}: {e}")
            return f"Image processing failed for {filename}"

    def _is_scanned_image(self, img: Image.Image) -> bool:
        """Detect if image is scanned document"""
        return img.mode == '1' or img.info.get('dpi', (0, 0))[0] > 300

    def _extract_ocr_text(self, img: Image.Image) -> str:
        """Extract text from scanned image using OCR"""
        try:
            ocr_text = pytesseract.image_to_string(img)
            return self._clean_ocr_text(ocr_text)
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            return "OCR text extraction failed"

    def _extract_vision_description(self, file_content: bytes) -> str:
        """Extract description from image using GPT-4 Vision"""
        try:
            response = openai.chat.completions.create(
                model=self.openai_model,
                messages=[
                    {"role": "system", "content": "You are an image analyst. Describe only what is visible in the image. Focus on text, labels, data, charts, and structural elements."},
                    {"role": "user", "content": "Describe this image in detail, focusing on any visible data, labels, text, charts, graphs, or structural elements. Include any numerical values, measurements, or quantitative information present."}
                ],
                files=[("image", file_content)],
                max_tokens=500
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Vision API failed: {e}")
            return "Image analysis failed"

    def _clean_ocr_text(self, text: str) -> str:
        """Clean and normalize OCR text"""
        if not text.strip():
            return text

        # Basic cleaning
        cleaned = text.encode('utf-8', errors='ignore').decode('utf-8')
        cleaned = re.sub(r'\s+', ' ', cleaned)
        cleaned = re.sub(r'\n\s*\n\s*\n+', '\n\n', cleaned)

        # Remove standalone page numbers
        lines = cleaned.split('\n')
        filtered_lines = []
        for line in lines:
            line = line.strip()
            if line and not re.match(r'^\s*\d+\s*$', line):
                filtered_lines.append(line)

        return '\n'.join(filtered_lines).strip()

    def extract_tables_from_pdf(self, pdf_content: bytes) -> List[Dict]:
        """Extract tables from PDF content with enhanced page number logging"""
        tables = []

        try:
            doc = fitz.open(stream=pdf_content, filetype="pdf")
            total_pages = len(doc)

            logger.info(
                f"Starting table extraction from PDF with {total_pages} pages")
            print(f"🔍 Extracting tables from {total_pages} pages...")

            for page_num, page in enumerate(doc):
                try:
                    # Find tables using PyMuPDF with enhanced detection
                    page_tables = page.find_tables(
                        vertical_strategy="lines",
                        horizontal_strategy="lines"
                    )

                    if page_tables:
                        logger.info(
                            f"Page {page_num + 1}: Found {len(page_tables)} potential tables")
                        print(
                            f"📊 Page {page_num + 1}: Found {len(page_tables)} potential tables")

                    for table_idx, table in enumerate(page_tables):
                        try:
                            table_data = table.extract()

                            if table_data and len(table_data) > 1:
                                # Convert to markdown format with page number
                                markdown_table = self._convert_table_to_markdown(
                                    table_data, page_num + 1, table_idx + 1
                                )

                                if markdown_table:
                                    table_info = {
                                        "content": markdown_table,
                                        "page": page_num + 1,
                                        "table_index": table_idx + 1,
                                        "type": "table",
                                        "rows": len(table_data),
                                        "columns": len(table_data[0]) if table_data else 0
                                    }
                                    tables.append(table_info)

                                    # Log successful table extraction
                                    logger.info(
                                        f"✅ Table {table_idx + 1} extracted from page {page_num + 1}: {table_info['rows']} rows, {table_info['columns']} columns")
                                    print(
                                        f"✅ Table {table_idx + 1} (Page {page_num + 1}): {table_info['rows']} rows, {table_info['columns']} columns")

                        except Exception as e:
                            logger.warning(
                                f"Failed to extract table {table_idx + 1} from page {page_num + 1}: {e}")
                            print(
                                f"⚠️ Table {table_idx + 1} (Page {page_num + 1}): Extraction failed - {e}")
                            continue

                except Exception as e:
                    logger.warning(
                        f"Failed to process page {page_num + 1} for table extraction: {e}")
                    print(
                        f"⚠️ Page {page_num + 1}: Table processing failed - {e}")
                    continue

            doc.close()

            # Log final table extraction summary
            logger.info(
                f"Table extraction complete: {len(tables)} tables found across {total_pages} pages")
            print(
                f"📊 Table extraction complete: {len(tables)} tables found across {total_pages} pages")

        except Exception as e:
            logger.error(f"PDF table extraction failed: {e}")
            print(f"❌ PDF table extraction failed: {e}")

        return tables

    def _convert_table_to_markdown(self, table_data: List[List[str]], page_num: int, table_num: int) -> str:
        """Convert table data to markdown format with enhanced page number display"""
        try:
            if not table_data or len(table_data) < 2:
                return ""

            # Clean table data
            cleaned_data = []
            for row in table_data:
                cleaned_row = []
                for cell in row:
                    if cell is None:
                        cleaned_row.append("")
                    else:
                        cleaned_cell = str(cell).strip()
                        cleaned_row.append(cleaned_cell)

                if any(cell.strip() for cell in cleaned_row):
                    cleaned_data.append(cleaned_row)

            if len(cleaned_data) < 2:
                return ""

            # Create markdown table with enhanced page number header
            markdown_lines = []

            # Enhanced table header with page number
            table_header = f"\n{'='*60}\n"
            table_header += f"📊 TABLE {table_num} | 📄 PAGE {page_num} | 📏 {len(cleaned_data)-1} rows × {len(cleaned_data[0])} columns\n"
            table_header += f"{'='*60}\n"
            markdown_lines.append(table_header)

            # Header row
            header = cleaned_data[0]
            markdown_lines.append("| " + " | ".join(header) + " |")
            markdown_lines.append(
                "| " + " | ".join(["---"] * len(header)) + " |")

            # Data rows
            for row in cleaned_data[1:]:
                while len(row) < len(header):
                    row.append("")
                markdown_lines.append(
                    "| " + " | ".join(row[:len(header)]) + " |")

            # Table footer
            table_footer = f"\n{'='*60}\n"
            table_footer += f"📊 End of Table {table_num} | 📄 Page {page_num}\n"
            table_footer += f"{'='*60}\n"
            markdown_lines.append(table_footer)

            return "\n".join(markdown_lines)

        except Exception as e:
            logger.error(f"Table markdown conversion failed: {e}")
            return ""

    def classify_content_type(self, text: str) -> str:
        """Classify content type based on text patterns"""
        text_lower = text.lower()

        # Check for table patterns
        for pattern in self.TABLE_PATTERNS:
            if re.search(pattern, text, re.MULTILINE):
                return "table"

        # Check for figure patterns
        for pattern in self.FIGURE_PATTERNS:
            if re.search(pattern, text_lower):
                return "figure"

        # Check for table-like structure (multiple pipe characters)
        if "|" in text and text.count("|") > 3:
            lines = text.split('\n')
            table_lines = sum(1 for line in lines if line.count("|") > 2)
            if table_lines >= 2:
                return "table"

        return "text"

    def detect_section(self, text: str) -> str:
        """Detect document section based on headers"""
        text_upper = text.upper()

        for header in self.SECTION_HEADERS:
            if header in text_upper:
                return header

        return "OTHER"

    def process_mixed_content(self, text: str) -> List[Dict]:
        """Process text that may contain mixed content types"""
        content_blocks = []

        # Split by potential table boundaries
        lines = text.split('\n')
        current_block = []
        current_type = "text"

        for line in lines:
            line_type = self.classify_content_type(line)

            # If type changes, save current block and start new one
            if line_type != current_type and current_block:
                content_blocks.append({
                    "content": "\n".join(current_block),
                    "type": current_type,
                    "section": self.detect_section("\n".join(current_block))
                })
                current_block = []
                current_type = line_type

            current_block.append(line)

        # Add final block
        if current_block:
            content_blocks.append({
                "content": "\n".join(current_block),
                "type": current_type,
                "section": self.detect_section("\n".join(current_block))
            })

        return content_blocks

    def enhance_text_with_tables(self, text: str, tables: List[Dict]) -> str:
        """Enhance text content with extracted tables"""
        if not tables:
            return text

        enhanced_text = text

        for table in tables:
            # Insert table at appropriate location
            enhanced_text += f"\n\n{table['content']}"

        return enhanced_text

    def create_content_metadata(self, content: str, content_type: str, section: str) -> Dict:
        """Create metadata for content chunk"""
        return {
            "content_type": content_type,
            "section": section,
            "token_count": len(content.split()),
            "char_count": len(content),
            "has_tables": "table" in content.lower() or "|" in content,
            "has_figures": any(pattern.replace(r'\d+', '') in content.lower() for pattern in self.FIGURE_PATTERNS)
        }

    def extract_pdf_with_page_numbers(self, pdf_content: bytes) -> List[Dict]:
        """Extract PDF content with detailed page number tracking and logging"""
        extracted_pages = []

        try:
            doc = fitz.open(stream=pdf_content, filetype="pdf")
            total_pages = len(doc)

            logger.info(
                f"🔍 Starting comprehensive PDF extraction: {total_pages} pages")
            print(
                f"🔍 Starting comprehensive PDF extraction: {total_pages} pages")

            for page_num, page in enumerate(doc):
                page_info = {
                    "page_number": page_num + 1,
                    "content": "",
                    "tables": [],
                    "figures": [],
                    "metadata": {}
                }

                try:
                    # Extract text content
                    page_text = page.get_text("text")
                    if page_text and page_text.strip():
                        page_info["content"] = page_text.strip()
                        logger.info(
                            f"📄 Page {page_num + 1}: Text extracted ({len(page_text)} chars)")
                        print(
                            f"📄 Page {page_num + 1}: Text extracted ({len(page_text)} chars)")
                    else:
                        logger.warning(
                            f"📄 Page {page_num + 1}: No text content")
                        print(f"⚠️ Page {page_num + 1}: No text content")

                    # Extract tables from this page
                    page_tables = page.find_tables(
                        vertical_strategy="lines",
                        horizontal_strategy="lines"
                    )

                    if page_tables:
                        logger.info(
                            f"📊 Page {page_num + 1}: Found {len(page_tables)} tables")
                        print(
                            f"📊 Page {page_num + 1}: Found {len(page_tables)} tables")

                        for table_idx, table in enumerate(page_tables):
                            try:
                                table_data = table.extract()
                                if table_data and len(table_data) > 1:
                                    table_info = {
                                        "table_index": table_idx + 1,
                                        "page_number": page_num + 1,
                                        "rows": len(table_data),
                                        "columns": len(table_data[0]) if table_data else 0,
                                        "data": table_data
                                    }
                                    page_info["tables"].append(table_info)

                                    logger.info(
                                        f"✅ Table {table_idx + 1} on page {page_num + 1}: {table_info['rows']}×{table_info['columns']}")
                                    print(
                                        f"✅ Table {table_idx + 1} (Page {page_num + 1}): {table_info['rows']}×{table_info['columns']}")
                            except Exception as e:
                                logger.warning(
                                    f"❌ Table {table_idx + 1} extraction failed on page {page_num + 1}: {e}")
                                print(
                                    f"❌ Table {table_idx + 1} (Page {page_num + 1}): Extraction failed - {e}")

                    # Extract images/figures
                    image_list = page.get_images()
                    if image_list:
                        logger.info(
                            f"🖼️ Page {page_num + 1}: Found {len(image_list)} images")
                        print(
                            f"🖼️ Page {page_num + 1}: Found {len(image_list)} images")

                        for img_idx, img in enumerate(image_list):
                            try:
                                xref = img[0]
                                pix = fitz.Pixmap(doc, xref)

                                if pix.n - pix.alpha < 4:  # GRAY or RGB
                                    figure_info = {
                                        "figure_index": img_idx + 1,
                                        "page_number": page_num + 1,
                                        "dimensions": f"{pix.width}×{pix.height}",
                                        "type": "image"
                                    }
                                    page_info["figures"].append(figure_info)

                                    logger.info(
                                        f"🖼️ Figure {img_idx + 1} on page {page_num + 1}: {pix.width}×{pix.height}")
                                    print(
                                        f"🖼️ Figure {img_idx + 1} (Page {page_num + 1}): {pix.width}×{pix.height}")

                                pix = None  # Free memory

                            except Exception as e:
                                logger.warning(
                                    f"❌ Figure {img_idx + 1} processing failed on page {page_num + 1}: {e}")
                                print(
                                    f"❌ Figure {img_idx + 1} (Page {page_num + 1}): Processing failed - {e}")

                    # Add page metadata
                    page_info["metadata"] = {
                        "total_tables": len(page_info["tables"]),
                        "total_figures": len(page_info["figures"]),
                        "text_length": len(page_info["content"]),
                        "has_content": bool(page_info["content"].strip())
                    }

                    extracted_pages.append(page_info)

                except Exception as e:
                    logger.error(
                        f"❌ Page {page_num + 1} processing failed: {e}")
                    print(f"❌ Page {page_num + 1}: Processing failed - {e}")
                    continue

            doc.close()

            # Log final extraction summary
            total_tables = sum(len(page["tables"]) for page in extracted_pages)
            total_figures = sum(len(page["figures"])
                                for page in extracted_pages)
            total_text_chars = sum(len(page["content"])
                                   for page in extracted_pages)

            logger.info(
                f"📊 PDF extraction complete: {len(extracted_pages)} pages, {total_tables} tables, {total_figures} figures, {total_text_chars} chars")
            print(
                f"📊 PDF extraction complete: {len(extracted_pages)} pages, {total_tables} tables, {total_figures} figures, {total_text_chars} chars")

        except Exception as e:
            logger.error(f"❌ Comprehensive PDF extraction failed: {e}")
            print(f"❌ Comprehensive PDF extraction failed: {e}")

        return extracted_pages

    def create_pdf_metadata_summary(self, pdf_details: List[Dict]) -> Dict:
        """Create a comprehensive metadata summary for PDF extraction results"""
        if not pdf_details:
            return {}

        try:
            total_pages = len(pdf_details)
            total_tables = sum(len(page.get('tables', []))
                               for page in pdf_details)
            total_figures = sum(len(page.get('figures', []))
                                for page in pdf_details)
            total_text_chars = sum(len(page.get('content', ''))
                                   for page in pdf_details)

            # Page-by-page summary
            page_summary = []
            for page_info in pdf_details:
                page_summary.append({
                    "page_number": page_info['page_number'],
                    "text_length": page_info['metadata']['text_length'],
                    "tables_count": page_info['metadata']['total_tables'],
                    "figures_count": page_info['metadata']['total_figures'],
                    "has_content": page_info['metadata']['has_content']
                })

            # Table summary
            table_summary = []
            for page_info in pdf_details:
                for table in page_info.get('tables', []):
                    table_summary.append({
                        "table_index": table['table_index'],
                        "page_number": table['page_number'],
                        "dimensions": f"{table['rows']}×{table['columns']}",
                        "rows": table['rows'],
                        "columns": table['columns']
                    })

            # Figure summary
            figure_summary = []
            for page_info in pdf_details:
                for figure in page_info.get('figures', []):
                    figure_summary.append({
                        "figure_index": figure['figure_index'],
                        "page_number": figure['page_number'],
                        "dimensions": figure['dimensions'],
                        "type": figure['type']
                    })

            metadata = {
                "document_summary": {
                    "total_pages": total_pages,
                    "total_tables": total_tables,
                    "total_figures": total_figures,
                    "total_text_characters": total_text_chars,
                    "extraction_timestamp": pd.Timestamp.now().isoformat()
                },
                "page_summary": page_summary,
                "table_summary": table_summary,
                "figure_summary": figure_summary,
                "content_distribution": {
                    "pages_with_tables": len([p for p in pdf_details if p['metadata']['total_tables'] > 0]),
                    "pages_with_figures": len([p for p in pdf_details if p['metadata']['total_figures'] > 0]),
                    "pages_with_text_only": len([p for p in pdf_details if p['metadata']['total_tables'] == 0 and p['metadata']['total_figures'] == 0 and p['metadata']['has_content']])
                }
            }

            # Log metadata summary
            logger.info(
                f"📊 PDF metadata summary created: {total_pages} pages, {total_tables} tables, {total_figures} figures")
            print(
                f"📊 PDF metadata summary created: {total_pages} pages, {total_tables} tables, {total_figures} figures")

            return metadata

        except Exception as e:
            logger.error(f"Failed to create PDF metadata summary: {e}")
            return {}
