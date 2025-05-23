import pymupdf  # 實際使用時需安裝 pymupdf 套件
import os
from PIL import Image
import io
import json
import re  # 新增正則表達式套件

def pdf_to_html(pdf_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    img_dir = os.path.join(output_dir, "images")
    os.makedirs(img_dir, exist_ok=True)

    doc = pymupdf.open(pdf_path)
    json_data = []
    
    # 正則表達式匹配題號與答案 (範例：1. (2))
    question_pattern = re.compile(r"^(\d+)\.\s*\((\d+)\)\s*")

    for page_num, page in enumerate(doc):
        text = page.get_text()
        
        # 分割題目 (假設每題以數字.開頭)
        questions = re.split(r'(\d+\.\s)', text)
        for i in range(1, len(questions), 2):
            q_number = questions[i].strip()
            q_content = questions[i+1].strip()
            
            # 提取答案 (若存在)
            answer_match = re.search(r'\((\d+)\)', q_content)
            if answer_match:
                answer = answer_match.group(0)  # 取得完整 (2) 格式
                q_content = q_content.replace(answer, '').strip()
            else:
                answer = ""
            
            # 組裝 JSON 結構
            json_data.append({
                "type": "text",
                "content": f"{q_number} {q_content}",
                "answer": answer
            })

        # 保留原有圖片處理邏輯 (略)... 

    # 輸出 JSON 檔案
    json_path = os.path.join(output_dir, "output.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    pdf_path = r"D:\Things\專案\題庫\119003A13.pdf"
    output_dir = r"D:\Things\專案\題庫\output"
    pdf_to_html(pdf_path, output_dir)
    print(f"轉換完成！結果已儲存至 {output_dir}")
