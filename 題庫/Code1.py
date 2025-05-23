import pymupdf  # 改用 pymupdf 模組
import os
from PIL import Image
import io
import json  # 新增 json 套件

def pdf_to_html(pdf_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    img_dir = os.path.join(output_dir, "images")
    os.makedirs(img_dir, exist_ok=True)

    doc = pymupdf.open(pdf_path)
    json_data = []  # 改用 JSON 資料結構

    for page_num, page in enumerate(doc):
        text = page.get_text()
        page_entry = {  # 建立每頁的 JSON 物件
            "page_number": page_num + 1,
            "text": text,
            "images": []
        }

        img_list = page.get_images(full=True)
        for img_idx, img in enumerate(img_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            ext = base_image["ext"]

            # 保留原有的 CMYK 處理
            if ext == "jpeg" and base_image.get("colorspace", 0) == 4:
                img_pil = Image.open(io.BytesIO(image_bytes))
                img_pil = img_pil.convert("RGB")
                buffer = io.BytesIO()
                img_pil.save(buffer, format="JPEG")
                image_bytes = buffer.getvalue()

            # 儲存圖片
            img_filename = f"p{page_num+1}_i{img_idx+1}.{ext}"
            img_path = os.path.join(img_dir, img_filename)
            with open(img_path, "wb") as img_file:
                img_file.write(image_bytes)

            # 記錄圖片路徑到 JSON
            page_entry["images"].append({
                "image_path": f"images/{img_filename}",
                "image_index": img_idx + 1
            })

        json_data.append(page_entry)

    # 輸出 JSON 檔案 (取代原本的 HTML/TXT 輸出)
    json_path = os.path.join(output_dir, "output.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    # 取得目前程式所在目錄
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # 搜尋同目錄下所有 PDF 檔案
    pdf_files = [f for f in os.listdir(current_dir) if f.lower().endswith('.pdf')]

    if not pdf_files:
        print("此目錄下沒有 PDF 檔案。")
    else:
        for pdf_file in pdf_files:
            pdf_path = os.path.join(current_dir, pdf_file)
            pdf_name = os.path.splitext(pdf_file)[0]
            output_dir = os.path.join(current_dir, f"output_{pdf_name}")
            pdf_to_html(pdf_path, output_dir)  # 函式名稱保留不變
            print(f"{pdf_file} 轉換完成！結果已儲存至 {output_dir}")
