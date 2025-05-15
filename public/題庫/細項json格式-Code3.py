import pymupdf
import os
from PIL import Image
import io
import json
import re

def pdf_to_html(pdf_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    img_dir = os.path.join(output_dir, "images")
    os.makedirs(img_dir, exist_ok=True)

    doc = pymupdf.open(pdf_path)
    result = []
    current_section = None
    img_counter = 0

    # 正則表達式匹配章節標題 (範例：11900 電腦軟體設計 丙級 工作項目01：電腦概論)
    section_pattern = re.compile(r"(\d{5})\s+(.*?)\s+工作項目(\d+)：(.+)")

    for page in doc:
        # 提取文字內容
        text_blocks = page.get_text("blocks", sort=True)
        
        for block in text_blocks:
            if block[6] == 0:  # 文字區塊
                text = block[4].strip()
                
                # 檢查是否為章節標題
                section_match = section_pattern.match(text)
                if section_match:
                    if current_section:
                        result.append(current_section)
                    
                    # 解析章節資訊
                    current_section = {
                        "type": "section",
                        "exam_code": section_match.group(1),
                        "cert_level": section_match.group(2),
                        "section_number": section_match.group(3),
                        "section_title": section_match.group(4),
                        "question_count": 0,
                        "questions": []
                    }
                    continue
                
                # 處理題目 (只有當已進入章節後才處理)
                if current_section and text:
                    # 分割題目並提取答案
                    questions = re.split(r'(\d+\.\s)', text)
                    for i in range(1, len(questions), 2):
                        q_number = questions[i].strip('. ')
                        q_content = questions[i+1].strip()
                        
                        # 提取答案格式 (範例：(2))
                        answer_match = re.search(r'\((\d+)\)', q_content)
                        answer = answer_match.group(0) if answer_match else ""
                        if answer:
                            q_content = q_content.replace(answer, "").strip()
                        
                        # 加入章節題目列表
                        current_section["questions"].append({
                            "type": "question",
                            "number": q_number,
                            "content": q_content,
                            "answer": answer,
                            "images": []
                        })
                        current_section["question_count"] += 1

            elif block[6] == 1:  # 圖片區塊
                # 圖片處理邏輯 (保持原有功能)...
                img_counter += 1
                # ...略過圖片儲存程式碼...
                
                # 將圖片路徑加入最近一個題目
                if current_section and current_section["questions"]:
                    current_section["questions"][-1]["images"].append(
                        f"images/p{page.number+1}_i{img_counter}.{ext}"
                    )

    # 加入最後一個章節
    if current_section:
        result.append(current_section)

    # 輸出 JSON
    json_path = os.path.join(output_dir, "output.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    pdf_path = r"D:\Things\專案\題庫\119003A13.pdf"
    output_dir = r"D:\Things\專案\題庫\output"
    pdf_to_html(pdf_path, output_dir)
    print(f"轉換完成！結果已儲存至 {output_dir}")
