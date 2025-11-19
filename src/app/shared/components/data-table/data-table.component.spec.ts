import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, TableColumn, TableAction } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should accept data input', () => {
      const testData = [{ id: 1, name: 'Test' }];
      component.data = testData;
      component.ngOnChanges({ data: { currentValue: testData, previousValue: [], firstChange: true, isFirstChange: () => true } });
      expect(component.filteredData).toEqual(testData);
      expect(component.total).toBe(1);
    });

    it('should accept columns input', () => {
      const testColumns: TableColumn[] = [
        { key: 'id', title: 'ID' },
        { key: 'name', title: 'Name', sortable: true }
      ];
      component.columns = testColumns;
      expect(component.columns).toEqual(testColumns);
    });

    it('should accept loading input', () => {
      component.loading = true;
      expect(component.loading).toBe(true);
    });

    it('should accept actions input', () => {
      const testActions: TableAction[] = [
        { label: 'Add', action: () => {} }
      ];
      component.actions = testActions;
      expect(component.actions).toEqual(testActions);
    });

    it('should accept rowActions input', () => {
      const testRowActions: TableAction[] = [
        { label: 'Edit', action: () => {} }
      ];
      component.rowActions = testRowActions;
      expect(component.rowActions).toEqual(testRowActions);
    });
  });

  describe('Output events', () => {
    it('should emit pageChange on query params change', () => {
      spyOn(component.pageChange, 'emit');
      const params = { pageIndex: 2, pageSize: 20 };
      component.onQueryParamsChange(params);
      expect(component.pageChange.emit).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 20 });
    });

    it('should emit sortChange on query params change with sort', () => {
      spyOn(component.sortChange, 'emit');
      const params = {
        pageIndex: 1,
        pageSize: 10,
        sort: [{ key: 'name', value: 'ascend' }]
      };
      component.onQueryParamsChange(params);
      expect(component.sortChange.emit).toHaveBeenCalledWith({ key: 'name', value: 'ascend' });
    });

    it('should emit filterChange on query params change with filter', () => {
      spyOn(component.filterChange, 'emit');
      const params = {
        pageIndex: 1,
        pageSize: 10,
        filter: { status: 'active' }
      };
      component.onQueryParamsChange(params);
      expect(component.filterChange.emit).toHaveBeenCalledWith({ key: 'status', value: 'active' });
    });

    it('should emit searchChange on search', () => {
      spyOn(component.searchChange, 'emit');
      component.searchValue = 'test';
      component.onSearch();
      expect(component.searchChange.emit).toHaveBeenCalledWith('test');
    });
  });

  describe('Methods', () => {
    beforeEach(() => {
      component.data = [
        { id: 1, name: 'John', status: 'active' },
        { id: 2, name: 'Jane', status: 'inactive' }
      ];
      component.ngOnChanges({ data: { currentValue: component.data, previousValue: [], firstChange: true, isFirstChange: () => true } });
    });

    it('should filter data on search', () => {
      component.searchValue = 'John';
      component.onSearch();
      expect(component.filteredData.length).toBe(1);
      expect(component.filteredData[0].name).toBe('John');
    });

    it('should return sort function', () => {
      const sortFn = component.sortFn('name');
      const result = sortFn({ name: 'a' }, { name: 'b' });
      expect(typeof result).toBe('number');
    });

    it('should update data on changes', () => {
      const newData = [{ id: 3, name: 'Bob' }];
      component.data = newData;
      component.ngOnChanges({ data: { currentValue: newData, previousValue: component.data, firstChange: false, isFirstChange: () => false } });
      expect(component.filteredData).toEqual(newData);
      expect(component.total).toBe(1);
    });
  });

  describe('Template rendering', () => {
    it('should render table with data', () => {
      component.data = [{ id: 1, name: 'Test' }];
      component.columns = [{ key: 'id', title: 'ID' }, { key: 'name', title: 'Name' }];
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const table = compiled.querySelector('nz-table');
      expect(table).toBeTruthy();
    });

    it('should show search input when showSearch is true', () => {
      component.showSearch = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const searchInput = compiled.querySelector('input[nz-input]');
      expect(searchInput).toBeTruthy();
    });

    it('should hide search input when showSearch is false', () => {
      component.showSearch = false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const searchInput = compiled.querySelector('input[nz-input]');
      expect(searchInput).toBeFalsy();
    });

    it('should show actions buttons', () => {
      component.actions = [{ label: 'Add', action: () => {} }];
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const actionButton = compiled.querySelector('button[nz-button]');
      expect(actionButton).toBeTruthy();
      expect(actionButton.textContent.trim()).toBe('Add');
    });
  });
});