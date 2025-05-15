import pymupdf  # 改用 pymupdf 模組
import os
from PIL import Image
import io

def pdf_to_html(pdf_path, output_dir):
    # 建立輸出目錄
    os.makedirs(output_dir, exist_ok=True)
    img_dir = os.path.join(output_dir, "images")
    os.makedirs(img_dir, exist_ok=True)

    doc = pymupdf.open(pdf_path)  # 使用 pymupdf.open() 而非 fitz.open()
    html_content = []
    txt_content = []

    for page_num, page in enumerate(doc):
        # 提取文字內容 (自動處理中文編碼)
        text = page.get_text()
        txt_content.append(f"=== 第 {page_num+1} 頁 ===\n{text}\n")

        # 提取圖片
        img_list = page.get_images(full=True)
        html_content.append(f"<div class='page'><h2>第 {page_num+1} 頁</h2>")
        html_content.append(f"<pre>{text}</pre>")

        if img_list:
            html_content.append("<div class='images'>")

        for img_idx, img in enumerate(img_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            ext = base_image["ext"]

            # 處理 CMYK 轉 RGB
            if ext == "jpeg" and base_image.get("colorspace", 0) == 4:  # CMYK=4
                img_pil = Image.open(io.BytesIO(image_bytes))
                img_pil = img_pil.convert("RGB")
                buffer = io.BytesIO()
                img_pil.save(buffer, format="JPEG")
                image_bytes = buffer.getvalue()

            # 儲存圖片
            img_path = os.path.join(img_dir, f"p{page_num+1}_i{img_idx+1}.{ext}")
            with open(img_path, "wb") as img_file:
                img_file.write(image_bytes)

            # 加入 HTML
            html_content.append(f"<img src='images/{os.path.basename(img_path)}' class='pdf-image'>")

        if img_list:
            html_content.append("</div>")
        html_content.append("</div>")

    # 寫入文字檔
    with open(os.path.join(output_dir, "output.txt"), "w", encoding="utf-8") as txt_file:
        txt_file.write("\n".join(txt_content))

    # 預先處理換行符，避免 f-string 錯誤
    html_body = "\n".join(html_content)
    
    # 生成完整 HTML
    html_template = f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <title>PDF 轉換結果</title>
    <style>
        .page {{ margin: 20px 0; border-bottom: 2px solid #ccc; padding-bottom: 20px; }}
        .images {{ margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px; }}
        .pdf-image {{ max-width: 300px; height: auto; border: 1px solid #ddd; }}
        pre {{ white-space: pre-wrap; font-family: 'Microsoft JhengHei', sans-serif; }}
    </style>
</head>
<body>
{html_body}
</body>
</html>"""

    with open(os.path.join(output_dir, "output.html"), "w", encoding="utf-8") as html_file:
        html_file.write(html_template)

if __name__ == "__main__":
    pdf_path = r"D:\Things\專案\題庫\119003A13.pdf"
    output_dir = r"D:\Things\專案\題庫\output"
    pdf_to_html(pdf_path, output_dir)
    print(f"轉換完成！結果已儲存至 {output_dir}")
