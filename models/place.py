from datetime import datetime
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user

# +----------------------+--------------+------+-----+---------+----------------+
# | Field                | Type         | Null | Key | Default | Extra          |
# +----------------------+--------------+------+-----+---------+----------------+
# | place_id             | integer      | NO   | PRI |         | auto_increment |
# | place_name           | varchar(50)  | NO   |     |         |                |
# | place_lat            | varchar(50)  | NO   |     |         |                |
# | place_lng            | varchar(50)  | NO   |     |         |                |
# | use_yn               | varchar(1)   | NO   |     | "Y"     |                |
# | user_id              | varchar(20)  | NO   |     |         |                |
# | project_id           | integer      | NO   |     |         | tbl_project    |
# | create_date          | datetime     | NO   |     |         |                |
# | modify_date          | datetime     | NO   |     |         |                |
# +----------------------+--------------+------+-----+---------+----------------+

class PlaceModel(db.Model):
    __tablename__ = 'tbl_place'

    place_id =    db.Column(db.Integer, primary_key=True)                                   # 설치지점 아이디
    place_name =  db.Column(db.String(50), nullable=False)                                  # 설치지점 이름
    place_lat =   db.Column(db.String(50), nullable=False)                                  # 설치지점 위도
    place_lng =   db.Column(db.String(50), nullable=False)                                  # 설치지점 경도
    place_index =   db.Column(db.String(50), nullable=False)                                  # 설치지점 경도
    use_yn =      db.Column(db.String(1), nullable=False, default="Y")                      # 설치지점 사용여부
    user_id =     db.Column(db.String(20), nullable=False)                                  # 설치지점 등록한 사용자 아이디
    project_id =  db.Column(db.Integer, nullable=False)                                     # 설치지점이 포함된 프로젝트 아이디
    create_date = db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date = db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, place_name, place_lat, place_lng,place_index, use_yn, user_id, project_id, create_date, modify_date):

        self.place_name = place_name
        self.place_lat = place_lat
        self.place_lng = place_lng
        self.place_index = place_index
        self.use_yn = use_yn
        self.user_id = user_id
        self.project_id = project_id
        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, place_id):
        return cls.query.filter_by(place_id=place_id).first()


    @classmethod
    def find_by_project_id(cls, project_id):
        sql = """select place_id,place_name,place_lat,place_lng,project_id,place_index from tbl_place
                where use_yn='Y' and project_id='"""+project_id+"';"

        return db.engine.execute(text(sql))

    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()

    # 구글 맵 용 가져오기
    @classmethod
    def find_map_data_by_project_id(cls, project_id):
        sql = """select a.place_name, a.place_lat, a.place_lng, b.project_lat, b.project_lng, a.place_index, a.place_id from tbl_place a
            left join tbl_project b on a.project_id = b.project_id
            where a.project_id = '"""+project_id+"""' and a.use_yn = 'Y';"""

        return db.engine.execute(text(sql))