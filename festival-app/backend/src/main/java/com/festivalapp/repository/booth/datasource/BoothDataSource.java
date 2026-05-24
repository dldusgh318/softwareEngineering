package com.festivalapp.repository.booth.datasource;

import com.festivalapp.domain.booth.Booth;
import java.util.List;

public interface BoothDataSource {

  List<Booth> findAll();
}
