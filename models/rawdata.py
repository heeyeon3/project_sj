from datetime import datetime
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user

# +----------------------+--------------+------+-----+---------+-----------------+
# | Field                | Type         | Null | Key | Default | Extra           |
# +----------------------+--------------+------+-----+---------+-----------------+
# | rawdata_id           | integer      | NO   | PRI |         | auto_increment  |
# | sensor_data_date     | datetime     | NO   |     |         |                 |
# | sensor_name          | varchar(20)  | NO   |     |         |                 |
# | sensor_data          | varchar(20)  | NO   |     |         |                 |
# | sensor_index         | integer      | NO   |     |         |                 |
# | datarogger_id        | integer      | NO   |     |         | tbl_datarogger  |
# | create_date          | datetime     | NO   |     |         |                 |
# | modify_date          | datetime     | NO   |     |         |                 |
# +----------------------+--------------+------+-----+---------+-----------------+

class RawdataModel(db.Model):
    __tablename__ = 'tbl_rawdata'

    rawdata_id =        db.Column(db.Integer, primary_key=True)                              # 원본 데이터 아이디
    sensor_data_date =  db.Column(db.DateTime, nullable=False)                               # 데이터 들어온 날짜
    sensor_name =         db.Column(db.String(10), nullable=False)                             # 센서 아이디
    sensor_data =       db.Column(db.String(20), nullable=False)                             # 센서 측정값
    sensor_index =       db.Column(db.Integer, nullable=False)                             # 센서 측정값
    datarogger_id =     db.Column(db.Integer, nullable=False)                                # 데이터로거 아이디
    create_date =       db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =       db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, sensor_data_date,  sensor_name, sensor_data, sensor_index, datarogger_id, create_date, modify_date):

        self.sensor_data_date = sensor_data_date
        self.sensor_name = sensor_name
        self.sensor_data = sensor_data
        self.sensor_index = sensor_index
        self.datarogger_id = datarogger_id
        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, rawdata_id):
        return cls.query.filter_by(rawdata_id=rawdata_id).first()

    @classmethod
    def find_by_datarogger_id(cls, datarogger_id):
        sql = "select date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S') sensor_data_date, datarogger_id from tbl_rawdata where datarogger_id = '"+datarogger_id+"""' 
                order by sensor_data_date desc limit 1"""

        return db.engine.execute(text(sql))


    @classmethod
    def datarogger_sensor_list(cls, datarogger_id):
        sql = """select distinct sensor_name, sensor_index from tbl_rawdata
                where datarogger_id = '"""+datarogger_id+"""';"""

        
        return db.engine.execute(text(sql))

    @classmethod
    def sensor_data_first(cls, datarogger_id, sensor_name):
        sql = """select date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S') sensor_data_date, sensor_data, sensor_name from tbl_rawdata
                where datarogger_id = '"""+datarogger_id+"""' and sensor_name = '"""+sensor_name+"""'
                order by sensor_data_date limit 1;"""

        
        return db.engine.execute(text(sql))


    @classmethod
    def sensor_data_all(cls, param):
        sensor_name, datarogger_id,date_time_start,date_time_end = param
        sql = """select date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S') sensor_data_date, sensor_data, sensor_name from tbl_rawdata
                where datarogger_id = '"""+datarogger_id+"""' and sensor_name = '"""+sensor_name+"""'
                and sensor_data_date between '"""+date_time_start+"""' and '"""+date_time_end+"""'"""

        
        return db.engine.execute(text(sql))


    @classmethod
    def rawdata_sensor_name_dataroggerid(param):

        sensor_name, datarogger_id, date_time_start, date_time_end, intervalday, time = param
        sql = """select date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S') sensor_data_date, sensor_name, sensor_data
                from tbl_rawdata
                where sensor_name ='"""+sensor_name+"""' and datarogger_id = '"""+datarogger_id+"""'
                and sensor_data_date between '"""+date_time_start+"""' and '"""+date_time_end+"""'"""


        if(len(time) != 0):
            sql += """ and substr(sensor_data_date,12,2)='"""+time+"""'"""
                
        if(len(intervalday) != 0):
            sql +=  """ and mod(TIMESTAMPDIFF(DAY,'"""+date_time_start+"""',sensor_data_date), """+intervalday+""")=0;"""

        
        return db.engine.execute(text(sql))


    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()