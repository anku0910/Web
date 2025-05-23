from bs4 import BeautifulSoup
import json
import re
import os

def extract_questions(content):
    soup = BeautifulSoup(content, 'html.parser')
    questions = []

    trs = soup.find_all('tr')
    for tr in trs:
        number_td = tr.find('td', align='center')
        if not number_td or not number_td.text.strip().isdigit():
            continue
        question_number = number_td.text.strip()

        tds = tr.find_all('td')
        content_td = None
        for td in tds:
            if td.find('input', {'type': 'radio'}):
                content_td = td
                break
        if not content_td:
            continue

        correct_btn = tr.find('input', id=re.compile(r'ans\d+_correct'))
        correct_answer = correct_btn.get('value') if correct_btn else None

        full_content = content_td.decode_contents()
        parts = full_content.split('<p>')
        if len(parts) > 0:
            question_part = parts[0]
            question_text = re.sub(r'<!--.*?-->', '', question_part, flags=re.DOTALL)
            question_text = BeautifulSoup(question_text, 'html.parser').text.strip()
            question_text = re.sub(r'\s+', ' ', question_text)
        else:
            question_text = "無法提取題目內容"

        options = []
        radio_inputs = content_td.find_all('input', {'type': 'radio'})
        for radio in radio_inputs:
            option_number = radio.get('value', '')
            option_html = str(radio.parent)
            pattern = r'\(\d+\)\s*&nbsp;(.*?)(?:&nbsp;&nbsp;|$)'
            match = re.search(pattern, option_html)
            if match:
                option_text = match.group(1).strip()
            else:
                next_sibling = radio.next_sibling
                if next_sibling:
                    option_text = str(next_sibling).replace('&nbsp;', ' ').strip()
                    match = re.search(r'\(\d+\)(.*?)(?:&nbsp;|$)', option_text)
                    if match:
                        option_text = match.group(1).strip()
                else:
                    option_text = f"選項{option_number}"
            option_text = BeautifulSoup(f"<div>{option_text}</div>", 'html.parser').text.strip()
            options.append({
                "value": option_number,
                "text": option_text
            })

        question_data = {
            'id': question_number,
            'title': question_text,
            'options': options,
            'correct_answer': correct_answer
        }
        questions.append(question_data)
    return questions

def main():
    abs_path = r'C:\Users\anku0\Documents\GitHub\Web\public\題庫\review_content.asp'
    output_file = r'C:\Users\anku0\Documents\GitHub\Web\public\題庫\review_content_questions.json'

    if not os.path.exists(abs_path):
        print(f"檔案不存在：{abs_path}")
        return

    # 嘗試不同編碼讀取
    try:
        with open(abs_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        with open(abs_path, 'r', encoding='big5') as f:
            content = f.read()

    # 移除ASP腳本
    cleaned_content = re.sub(r'<%([^%]|%[^>])*%>', '', content)
    questions = extract_questions(cleaned_content)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    print(f"已成功將 {len(questions)} 個題目存至 {output_file}")

if __name__ == "__main__":
    main()
