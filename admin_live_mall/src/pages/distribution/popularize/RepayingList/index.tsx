import { useRef, useState } from 'react';
import { TableRequest } from '@/pages/utils/tableRequest';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import type { TableListItem } from './data';
import { ITemplateParams } from '@/pages/distribution/popularize/PopularizeList/data';
import { clearRecord, postExport } from './service';
import { Button, Image } from 'antd';
import { exportExcelBlob } from '@/pages/utils/export';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import dayjs from 'dayjs';

export default () => {
  const ref = useRef<ActionType>();

  const [templateParams, setTemplateParams] = useState<ITemplateParams>();
  const [showExportModel, setShowExportModel] = useState(false);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '起止时间',
      valueType: 'dateTimeRange',
      dataIndex: 'time',
      hideInTable: true,
      search: {
        transform: (record) => {
          return {
            startTime: record[0],
            endTime: record[1],
          };
        },
      },
      fieldProps: {
        placeholder: ['开始时间', '结束时间'],
      },
    },
    {
      title: '团长信息',
      dataIndex: 'teamInfo',
      hideInTable: true,
      fieldProps: {
        placeholder: '备注名/昵称/手机号/ID',
      },
    },

    {
      title: '原上级',
      dataIndex: 'supInfo',
      hideInTable: true,
      fieldProps: {
        placeholder: '备注名/昵称/手机号/ID',
      },
    },

    {
      title: '团长信息',
      width: 160,
      search: false,
      render: (node, record) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: '50%' }}
              src={record.teamImage}
              preview={false}
            />

            <div style={{ marginLeft: 8, color: 'rgba(0, 0, 0, 0.65)' }}>
              <div>昵称：{record.teamName ?? '-'}</div>
              <div>ID：{record.teamId ?? '-'}</div>
              <div>手机号：{record.teamPhone ?? '-'}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '原上级',
      width: 120,
      search: false,
      render: (node, record) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: '50%' }}
              src={record.teamImage}
              preview={false}
            />

            <div style={{ marginLeft: 8, color: 'rgba(0, 0, 0, 0.65)' }}>
              <div>昵称：{record.supName ?? '-'}</div>
              <div>ID：{record.supId ?? '-'}</div>
              <div>手机号：{record.supPhone ?? '-'}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '清退时间',
      dataIndex: 'createTime',
      width: 90,
      search: false,
    },

    {
      title: '清退操作人',
      width: 120,
      search: false,
      render: (node, record) => {
        return (
          <div style={{ marginLeft: 8, color: 'rgba(0, 0, 0, 0.65)' }}>
            <div>昵称：{record.clearName}</div>
            <div>手机号：{record.clearPhone}</div>
          </div>
        );
      },
    },
    {
      title: '下级用户转移给',
      width: 120,
      search: false,
      render: (node, record) => {
        return (
          <div style={{ marginLeft: 8, color: 'rgba(0, 0, 0, 0.65)' }}>
            <div>昵称：{record.transferName}</div>
            <div>手机号：{record.transferPhone}</div>
          </div>
        );
      },
    },
  ];
  // 导出列表
  const onExportList = async (excludeColumnFieldNames: string[]) => {
    postExport({ ...templateParams, excludeColumnFieldNames }).then((res) => {
      exportExcelBlob(`清退记录 ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`, res);
    });
  };
  return (
    <>
      <ProTable<TableListItem>
        rowKey="id"
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1400 }}
        headerTitle="清退列表"
        search={{
          labelWidth: 'auto',
          span: 8,
          collapsed: false,
          collapseRender: () => null,
          optionRender: (searchConfig, props, dom) => [
            ...dom,
            <Button
              key="exportTeam"
              // onClick={() => {
              //   postExport(templateParams).then((res) => {
              //     exportExcelBlob(`清退记录 ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`, res);
              //   });
              // }}
              onClick={() => setShowExportModel(true)}
            >
              导出
            </Button>,
          ],
        }}
        request={(params) => {
          setTemplateParams(params as ITemplateParams);
          return TableRequest(params, clearRecord);
        }}
      />
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.TeamClearRecordToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </>
  );
};
