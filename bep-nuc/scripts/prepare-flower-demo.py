"""Create web copies and the reviewed catalogue; originals are never changed."""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib, json

root = Path(__file__).resolve().parents[1]
source = Path('C:/Users/Admin/Desktop/hoa')
rows = [
 ('ken-hong','Kèn hồng 1T',10,'cành',99000,'1793582528066','khuc-ban-chieu',''),
 ('ly-kep-trang','Ly kép trắng',5,'cành',129000,'1793582528114','a-flower','3–4 tai theo bảng cung cấp; chưa kiểm đếm từ ảnh'),
 ('ly-kep-hong','Ly kép hồng',5,'cành',159000,'1793582528176','a-flower','4–5 tai theo bảng cung cấp; chưa kiểm đếm từ ảnh'),
 ('chuoi-dieu','Chuối điểu',30,'bông',75000,'1793582528415','khuc-ban-chieu',''),
 ('huong-duong','Hướng dương',5,'bông',29000,'1793582528490','khuc-ban-chieu',''),
 ('hoa-chuong','Hoa chuông',1,'bó',49000,'1793582528618','a-flower','Chưa xác định số cành trong bó'),
 ('mao-luong-mix','Mao lương mix',10,'bông',49000,'1793582528919','a-flower',''),
 ('mao-luong-canh-buom','Mao lương cánh bướm',1,'bó',59000,'1793582528972','a-flower','Chưa xác định số cành trong bó'),
 ('scabiosa','Scabiosa',1,'bó',49000,'1793582529033','khuc-ban-chieu','Chưa xác định số cành trong bó'),
 ('phang-tim-vien','Phăng tím viền',20,'bông',59000,'1793582529086','khuc-ban-chieu',''),
 ('phang-do-nhung','Phăng đỏ nhung',20,'bông',59000,'1793582529279','khuc-ban-chieu',''),
 ('phang-xanh-trang','Phăng mix xanh–trắng',20,'bông',59000,'1793582529335','a-flower',''),
]
out = root/'public/food-images'; out.mkdir(parents=True, exist_ok=True)
items=[]
for slug,name,count,unit,reference,prefix,shop,note in rows:
 matches=list(source.glob(prefix+'*.jpg')); assert len(matches)==1, prefix
 original=matches[0]
 im=ImageOps.exif_transpose(Image.open(original)).convert('RGB'); im.thumbnail((1200,1200))
 target=out/f'flower-{slug}.webp'; im.save(target, 'WEBP', quality=82, method=6)
 items.append(dict(id='flower-'+slug,name=name,shopId='flower-'+shop,quantity=dict(amount=count,unit=unit),referencePrice=reference,price=reference*7//10,image='/food-images/'+target.name,sourceFile=original.name,sourceSha256=hashlib.sha256(original.read_bytes()).hexdigest(),note=note,identification='reviewed-demo'))
(root/'lib/flower-catalogue.json').write_text(json.dumps(items,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'products':len(items),'web_bytes':sum(p.stat().st_size for p in out.glob('flower-*.webp'))}))
