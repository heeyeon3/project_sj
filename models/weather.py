from datetime import datetime

from sqlalchemy import sql
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user

# +----------------------+--------------+------+-----+---------+-----------------+
# | Field                | Type         | Null | Key | Default | Extra           |
# +----------------------+--------------+------+-----+---------+-----------------+
# | weather_id            | integer      | NO   | PRI |         | auto_increment  |
# | weather_status       | varchar(20)  | NO   |     |         |                 |
# | sensor_id      | varchar(50)  | NO   |     |         |                 |
# | datarogger_id               | varchar(1)   | NO   |     | "Y"     |                 |
# | use_yn              | varchar(20)  | NO   |     |         |                 |
# | project_id           | integer      | NO   |     |         | tbl_project     |
# | create_date          | datetime     | NO   |     |         |                 |
# | modify_date          | datetime     | NO   |     |         |                 |
# +----------------------+--------------+------+-----+---------+-----------------+

class weatherModel(db.Model):
    __tablename__ = 'tbl_weather'

    weather_id =         db.Column(db.Integer, primary_key=True)                                 # 공지사항 아이디
    weather_date =     db.Column(db.DateTime, nullable=False)                                # 공지사항 이름
    weather_nx =     db.Column(db.String(45), nullable=False)                                # 공지사항 이름
    weather_ny =     db.Column(db.String(45), nullable=False)                                # 공지사항 이름
    weather_t1h =        db.Column(db.String(45), nullable=False)                                # 공지사항 식
    weather_rn1 =        db.Column(db.String(45), nullable=False)                                # 공지사항 식
    create_date =      db.Column(db.DateTime, nullable=False, default=datetime.now())
    

    def __init__(self, weather_date, weather_nx,  weather_ny, weather_t1h, weather_rn1, create_date):

        self.weather_date = weather_date
        self.weather_nx = weather_nx
        self.weather_ny = weather_ny
        self.weather_t1h = weather_t1h
        self.weather_rn1 = weather_rn1
        
        self.create_date = create_date

        

    @classmethod
    def find_by_id(cls, weather_id):
        return cls.query.filter_by(weather_id=weather_id).first()

    @classmethod
    def weather_data(cls, params):
        nx, ny, date_time_start, date_time_end =params
        sql ="""select date_format(weather_date, '%Y.%m.%d %H:%i:%S') weather_date, weather_nx, weather_ny, weather_t1h, weather_rn1 from tbl_weather
                where weather_nx = '"""+nx+"' and weather_ny='"+ny+"' and weather_date between '"+date_time_start+"' and '"+date_time_end+"';"

          
        return db.engine.execute(text(sql))
    
    @classmethod
    def weather_data_avg_day(cls, params):
        nx, ny, date_time_start, date_time_end =params

        sql = """select date_format(substring(weather_date, 1, 10), '%Y.%m.%d') weather_date, max(weather_t1h) weather_t1h, max(weather_rn1) weather_rn1
                from tbl_weather  where weather_nx = '"""+nx+"' and weather_ny='"+ny+"' and weather_date between '"+date_time_start+"' and '"+date_time_end+"""'
                group by date_format(substring(weather_date, 1, 10), '%Y.%m.%d')"""

        # sql ="""select date_format(weather_date, '%Y.%m.%d %H:%i:%S') weather_date, weather_nx, weather_ny, weather_t1h, weather_rn1 from tbl_weather
        #         where weather_nx = '"""+nx+"' and weather_ny='"+ny+"' and weather_date between '"+date_time_start+"' and '"+date_time_end+"';"

        print(sql)
        return db.engine.execute(text(sql))


    # @classmethod
    # def find_by_weather_list(cls):
    #     sql ="""select weather_id, weather_title, weather_contents, date_format(create_date, '%Y-%m-%d %H:%i:%S') create_date
    #             from tbl_weather order by create_date desc"""
    #     return db.engine.execute(text(sql))


  
    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()