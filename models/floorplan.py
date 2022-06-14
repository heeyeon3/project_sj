from datetime import datetime
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user

# +----------------------+--------------+------+-----+---------+-----------------+
# | Field                | Type         | Null | Key | Default | Extra           |
# +----------------------+--------------+------+-----+---------+-----------------+
# | floorplan_id         | biginteger   | NO   | PRI |         | auto_increment  |
# | floorplan_x          | varchar(50)  | NO   |     |         |                 |
# | floorplan_y          | varchar(50)  | NO   |     |         |                 |
# | sensorgroup_id       | varchar(10)  | NO   |     |         | tbl_sensorgroup |
# | senser_id            | varchar(10)  | NO   |     |         | tbl_sensor      |
# | use_yn               | varchar(1)   | NO   |     | "Y"     |                 |
# | user_id              | varchar(20)  | NO   |     |         |                 |
# | project_id           | integer      | NO   |     |         | tbl_project     |
# | create_date          | datetime     | NO   |     |         |                 |
# | modify_date          | datetime     | NO   |     |         |                 |
# +----------------------+--------------+------+-----+---------+-----------------+

class FloorplanModel(db.Model):
    __tablename__ = 'tbl_floorplan'

    floorplan_id =      db.Column(db.BigInteger, primary_key=True)                               # 현장도면라벨 아이디
    floorplan_x =       db.Column(db.String(50), nullable=False)                              # 현장도면라벨 x 좌표
    floorplan_y =       db.Column(db.String(50), nullable=False)                              # 현장도면라벨 y 좌표
    sensorgroup_id =    db.Column(db.String(10), nullable=False)                              # 현장도면라벨 매핑 센서그룹 아이디
    sensor_id =         db.Column(db.String(10), nullable=False)                              # 현장도면라벨 매핑 센서 아이디 (ALL일때, ALL)
    use_yn =            db.Column(db.String(1), nullable=False, default="Y")                  # 현장도면라벨 사용여부
    user_id =           db.Column(db.String(20), nullable=False)                              # 현장도면라벨 등록한 사용자 아이디
    project_id =        db.Column(db.Integer, nullable=False)                                 # 현장도면라벨이 포함된 프로젝트 아이디
    create_date =       db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =       db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, floorplan_x, floorplan_y, sensorgroup_id, sensor_id, use_yn, user_id, project_id, create_date, modify_date):

        self.floorplan_x = floorplan_x
        self.floorplan_y = floorplan_y
        self.sensorgroup_id = sensorgroup_id
        self.sensor_id = sensor_id
        self.use_yn = use_yn
        self.user_id = user_id
        self.project_id = project_id
        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, floorplan_id):
        return cls.query.filter_by(floorplan_id=floorplan_id).first()

    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()



    @classmethod
    def find_floorplan_list(cls, project_id):
        sql = """select a.sensor_id, a.floorplan_id, a.floorplan_x, a.floorplan_y,  a.project_id, b.sensor_display_name, b.sensor_type, c.sensorgroup_type, a.sensorgroup_id, c.sensorgroup_name from tbl_floorplan a
                left join tbl_sensor b on a.sensor_id = b.sensor_id
                left join tbl_sensorgroup c on a.sensorgroup_id = c.sensorgroup_id
                where a.use_yn = 'Y' and a.project_id='"""+project_id+"""';"""
                
        return db.engine.execute(text(sql))