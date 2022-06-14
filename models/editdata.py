from datetime import datetime
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user

# +----------------------+--------------+------+-----+---------+-----------------+
# | Field                | Type         | Null | Key | Default | Extra           |
# +----------------------+--------------+------+-----+---------+-----------------+
# | editdata_id          | integer      | NO   | PRI |         | auto_increment  |
# | sensor_data_date     | datetime     | NO   |     |         |                 |
# | sensor_name          | varchar(20)  | NO   |     |         |                 |
# | sensor_data          | varchar(20)  | NO   |     |         |                 |
# | sensor_index         | integer      | NO   |     |         |                 |
# | edit_yn              | varchar(1)   | NO   |     |         |                 |
# | user_id              | varchar(20)  | NO   |     |         |                 |
# | datarogger_id        | integer      | NO   |     |         | tbl_datarogger  |
# | create_date          | datetime     | NO   |     |         |                 |
# | modify_date          | datetime     | NO   |     |         |                 |
# +----------------------+--------------+------+-----+---------+-----------------+

class EditdataModel(db.Model):
    __tablename__ = 'tbl_editdata'

    editdata_id =       db.Column(db.Integer, primary_key=True)                              # 원본 데이터 아이디
    sensor_data_date =  db.Column(db.DateTime, nullable=False)                               # 데이터 들어온 날짜
    sensor_name =         db.Column(db.String(10), nullable=False)                           # 센서 아이디
    sensor_data =       db.Column(db.String(20), nullable=False)                             # 센서 측정값
    sensor_index =       db.Column(db.Integer, nullable=False)                             # 센서 측정값
    edit_yn =           db.Column(db.String(20), nullable=False)                             # 센서 측정값
    use_yn =           db.Column(db.String(1), nullable=False)                             # 센서 측정값
    user_id =           db.Column(db.String(20), nullable=True)                             # 센서 측정값
    datarogger_id =     db.Column(db.Integer, nullable=False)                                # 데이터로거 아이디
    create_date =       db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =       db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, sensor_data_date,  sensor_name, sensor_data, sensor_index, edit_yn, use_yn, user_id, datarogger_id, create_date, modify_date):

        self.sensor_data_date = sensor_data_date
        self.sensor_name = sensor_name
        self.sensor_data = sensor_data
        self.sensor_index = sensor_index
        self.edit_yn = edit_yn
        self.use_yn = use_yn
        self.user_id = user_id
        self.datarogger_id = datarogger_id
        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, editdata_id):
        return cls.query.filter_by(editdata_id=editdata_id).first()

    @classmethod
    def find_by_editdata(cls, sensor_name, datarogger_id, sensor_data_date):
        return cls.query.filter_by(sensor_name=sensor_name, datarogger_id=datarogger_id, sensor_data_date=sensor_data_date).first()

    @classmethod
    def editdata_sensor_name_dataroggerid(cls, param):

            sensor_name, datarogger_id, date_time_start, date_time_end, intervalday, time = param
            print(param)
            # sql = """select date_format(sensor_data_date, '%Y.%m.%d %H:%i:%S') sensor_data_date, sensor_name, sensor_data
            #         from tbl_editdata
            #         where sensor_name ='"""+sensor_name+"""' and datarogger_id = '"""+datarogger_id+"""'
            #         and sensor_data_date between '"""+date_time_start+"""' and '"""+date_time_end+"""'and substr(sensor_data_date,12,2)='"""+time+"""'
            #         and mod(TIMESTAMPDIFF(DAY,'"""+date_time_start+"""',sensor_data_date), """+intervalday+""")=0;"""
            sql = """select distinct date_format(sensor_data_date, '%Y.%m.%d %H:%i:%S') sensor_data_date, sensor_name, sensor_data, use_yn, datarogger_id
                    from tbl_editdata
                    where sensor_name ='"""+sensor_name+"""' and datarogger_id = '"""+datarogger_id+"""'
                    and sensor_data_date between '"""+date_time_start+"""' and '"""+date_time_end+"""'"""

            if(len(time) != 0):   
                sql += """and substr(sensor_data_date,12,2)='"""+time+"""'"""

            if(len(intervalday) != 0):   
               
                sql +=  """and mod(TIMESTAMPDIFF(DAY,'"""+date_time_start+"""',sensor_data_date), """+intervalday+""")=0;"""

           
            sql += " and use_yn='Y' order by sensor_data_date "    
            print(sql)
            return db.engine.execute(text(sql))

    @classmethod
    def editdata_sensor_name_dataroggerid_useyn_all(cls, param):

            sensor_name, datarogger_id, date_time_start, date_time_end, intervalday, time = param
            print(param)
            # sql = """select date_format(sensor_data_date, '%Y.%m.%d %H:%i:%S') sensor_data_date, sensor_name, sensor_data
            #         from tbl_editdata
            #         where sensor_name ='"""+sensor_name+"""' and datarogger_id = '"""+datarogger_id+"""'
            #         and sensor_data_date between '"""+date_time_start+"""' and '"""+date_time_end+"""'and substr(sensor_data_date,12,2)='"""+time+"""'
            #         and mod(TIMESTAMPDIFF(DAY,'"""+date_time_start+"""',sensor_data_date), """+intervalday+""")=0;"""
            sql = """select distinct date_format(sensor_data_date, '%Y.%m.%d %H:%i:%S') sensor_data_date, sensor_name, sensor_data, use_yn
                    from tbl_editdata
                    where sensor_name ='"""+sensor_name+"""' and datarogger_id = '"""+datarogger_id+"""'
                    and sensor_data_date between '"""+date_time_start+"""' and '"""+date_time_end+"""'"""

            if(len(time) != 0):   
                sql += """and substr(sensor_data_date,12,2)='"""+time+"""'"""

            if(len(intervalday) != 0):   
               
                sql +=  """and mod(TIMESTAMPDIFF(DAY,'"""+date_time_start+"""',sensor_data_date), """+intervalday+""")=0;"""

           
            sql += " order by sensor_data_date "    
            # print(sql)
            return db.engine.execute(text(sql))


    @classmethod
    def one_day_avg(cls, param):
        sensor_name, datarogger_id, date_time_start, date_time_end, intervalday, time = param
        sql = """select date_format(substring(sensor_data_date, 1, 10), '%Y.%m.%d') sensor_data_date, avg(sensor_data) sensor_data from tbl_editdata
                    where sensor_name = '"""+sensor_name+"' and datarogger_id = '"+datarogger_id+"' and sensor_data_date between '"+date_time_start+"' and '"+date_time_end+"""'
                     and use_yn='Y'
                    group by date_format(substring(sensor_data_date, 1, 10), '%Y.%m.%d')
                    order by date_format(substring(sensor_data_date, 1, 10), '%Y.%m.%d')"""

        print(sql)

        return db.engine.execute(text(sql))


    @classmethod
    def editdata_all(cls, param):

        sensordataname_list, datarogger_id, date_time_start, date_time_end, intervalday, time = param

        # sql = """select distinct date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S') sensor_data_date, sensor_name, sensor_data
        #         from tbl_editdata
        #         where sensor_name in ("""+sensordataname_list+""") and datarogger_id = '"""+datarogger_id+"""'
        #         and sensor_data_date between '"""+date_time_start+"""' and '"""+date_time_end+"""'and substr(sensor_data_date,12,2)='"""+time+"""'
        #        ;"""
        sql = """select distinct date_format(a.sensor_data_date, '%Y-%m-%d %H:%i:%S') sensor_data_date, a.sensor_name, a.sensor_data, b.sensor_display_name, b.sensor_type
                from tbl_editdata a
                left join tbl_sensor b on a.sensor_name = b.sensor_name and a.datarogger_id = b.datarogger_id
                where a.sensor_name in ("""+sensordataname_list+""") and a.datarogger_id = '"""+datarogger_id+"""'
                and sensor_data_date between '"""+date_time_start+"""' and '"""+date_time_end+"""'"""

        if(len(time) != 0):   
                sql += """and substr(sensor_data_date,12,2)='"""+time+"""'"""

        if(len(intervalday) != 0):   
            
            sql +=  """and mod(TIMESTAMPDIFF(DAY,'"""+date_time_start+"""',sensor_data_date), """+intervalday+""")=0;"""
        # sql = """select distinct date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S') sensor_data_date, sensor_name, sensor_data
        #         from tbl_editdata
        #         where sensor_name in ("""+sensordataname_list+""") and datarogger_id = '"""+datarogger_id+"""'
        #         and sensor_data_date between '"""+date_time_start+"""' and '"""+date_time_end+"""'and substr(sensor_data_date,12,2)='"""+time+"""'
        #         and mod(TIMESTAMPDIFF(DAY,'"""+date_time_start+"""',sensor_data_date), """+intervalday+""")=0;"""

        sql += " and a.use_yn='Y' order by a.sensor_data_date "    
 
        return db.engine.execute(text(sql))


    @classmethod
    def find_initial_data(cls, param):

        sensor_name, datarogger_id, sensor_date = param
        print(param)
        sql = """select  date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S') sensor_data_date, sensor_data
                from tbl_editdata
                where sensor_name ='"""+sensor_name+"""' and datarogger_id = '"""+datarogger_id+"""'
                and sensor_data_date ='"""+sensor_date+"""'"""
        
        sql += " and use_yn='Y' order by sensor_data_date "    
        
        return db.engine.execute(text(sql))

    @classmethod
    def sensor_data_all(cls, param):
        sensor_name, datarogger_id, date_time_start ,date_time_end= param
        sql = """select date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S') sensor_data_date, sensor_data, sensor_name from tbl_editdata
                where datarogger_id = '"""+datarogger_id+"""' and sensor_name = '"""+sensor_name+"""'
                and sensor_data_date between '"""+date_time_start+"""' and '"""+date_time_end+"""'"""
        sql += " and use_yn='Y' order by sensor_data_date "    

        return db.engine.execute(text(sql))

    @classmethod
    def sensor_initail_data_sensorgroup(cls, sensor_id, sensor_initial_data ):
        # sensor_id, sensor_initial_data = param
        sql = """select a.sensor_name, a.sensor_data_date, a.sensor_data, b.sensor_id from tbl_editdata a
                left join tbl_sensor b
                on a.sensor_name =b.sensor_name
                where b.sensor_id = '"""+sensor_id+"""'
                and a.sensor_data_date = '"""+sensor_initial_data+"""'  and a.use_yn='Y'
            """

        return db.engine.execute(text(sql))


    @classmethod
    def last_editdata(cls, sensor_name, datarogger_id ):
        # sensor_id, sensor_initial_data = param
        sql = """select sensor_name, date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S'), sensor_data, sensor_id from tbl_editdata 
              
                where sensor_name = '"""+sensor_name+"""'
                and datarogger_id = '"""+datarogger_id+"""' and use_yn='Y' order by sensor_data_date desc limit 1;
            """

        return db.engine.execute(text(sql))


    @classmethod
    def find_sensor_data(cls, sensor_name, datarogger_id , sensor_data_date):
        # sensor_id, sensor_initial_data = param
        sql = """select editdata_id, sensor_name, date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S'), sensor_data from tbl_editdata 
              
                where sensor_name = '"""+sensor_name+"""'
                and datarogger_id = '"""+datarogger_id+"""' and sensor_data_date = '"""+sensor_data_date+"""' and use_yn='Y';
            """
        print(sql)
        
        return db.engine.execute(text(sql))

    @classmethod
    def find_sensor_data_excel(cls, sensor_name, datarogger_id , sensor_data_date):
        # sensor_id, sensor_initial_data = param
        sql = """select editdata_id, sensor_name, date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S'), sensor_data from tbl_editdata 
              
                where sensor_name = '"""+sensor_name+"""'
                and datarogger_id = '"""+datarogger_id+"""' and sensor_data_date = '"""+sensor_data_date+"""';
            """
        print(sql)
        
        return db.engine.execute(text(sql))
    
    @classmethod
    def find_sensor_first_data(cls,datarogger_id , sensor_data_date):

        sql = """select date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S') sensor_data_date from tbl_editdata
                    where sensor_data_date like '"""+sensor_data_date+"""%' and datarogger_id = '"""+datarogger_id+"""' and use_yn='Y'
                    limit 1
            """

        
        return db.engine.execute(text(sql))
    
    @classmethod
    def find_sensor_edit_data_list(cls,datarogger_id , sensor_data_date):

        sql = """select editdata_id, sensor_name from tbl_editdata
                where sensor_data_date = '"""+sensor_data_date+"""' and datarogger_id = '"""+datarogger_id+"""'
                
            """
        print(sql)
        
        return db.engine.execute(text(sql))

    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()